package io.veritas.mobile

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

private val Ink = Color(0xFF07111F)
private val Mint = Color(0xFF19D3C5)
private val Soft = Color(0xFFEAF3F5)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { VeritasApp() }
    }
}

data class Document(
    val id: String,
    val title: String,
    val content: String,
    val status: String,
    val references: JSONArray
)

private class VeritasApi {
    private val baseUrl = BuildConfig.API_BASE_URL.trimEnd('/')
    private var cookie: String? = null

    suspend fun login(email: String, password: String): Result<Unit> = request("/api/auth/login", "POST", JSONObject().apply {
        put("email", email)
        put("password", password)
    }).map { Unit }

    suspend fun documents(): Result<List<Document>> = request("/api/documents", "GET").map { body ->
        val list = mutableListOf<Document>()
        val json = JSONObject(body).optJSONArray("documents") ?: JSONArray()
        for (index in 0 until json.length()) list += parseDocument(json.getJSONObject(index))
        list
    }

    suspend fun save(document: Document, sourceUrl: String): Result<Document> {
        val references = JSONArray(document.references.toString())
        if (sourceUrl.isNotBlank()) references.put(JSONObject().apply {
            put("title", "Mobile reference")
            put("author", "")
            put("url", sourceUrl)
            put("note", "Added from Veritas mobile")
        })
        return request("/api/documents/${document.id}", "PATCH", JSONObject().apply {
            put("title", document.title)
            put("content", document.content)
            put("references", references)
        }).map { parseDocument(JSONObject(it).getJSONObject("document")) }
    }

    suspend fun seal(document: Document): Result<Unit> = request("/api/documents/${document.id}/seal", "POST", JSONObject().apply {
        put("telemetry", JSONObject().apply { put("client", "android") })
    }).map { Unit }

    private suspend fun request(path: String, method: String, body: JSONObject? = null): Result<String> = withContext(Dispatchers.IO) {
        runCatching {
            val connection = (URL(baseUrl + path).openConnection() as HttpURLConnection).apply {
                requestMethod = method
                connectTimeout = 15000
                readTimeout = 15000
                setRequestProperty("Accept", "application/json")
                cookie?.let { setRequestProperty("Cookie", it) }
                if (body != null) {
                    doOutput = true
                    setRequestProperty("Content-Type", "application/json")
                }
            }
            body?.let { connection.outputStream.use { stream -> stream.write(it.toString().toByteArray()) } }
            val responseStream = if (connection.responseCode in 200..299) connection.inputStream else connection.errorStream
            val response = responseStream?.bufferedReader()?.use { it.readText() }.orEmpty()
            connection.headerFields["Set-Cookie"]?.firstOrNull()?.substringBefore(';')?.let { cookie = it }
            if (connection.responseCode !in 200..299) error(JSONObject(response).optString("error", "Request failed"))
            response
        }
    }

    private fun parseDocument(json: JSONObject) = Document(
        id = json.getString("id"),
        title = json.optString("title", "Untitled draft"),
        content = json.optString("content", ""),
        status = json.optString("status", "draft"),
        references = json.optJSONArray("references") ?: JSONArray()
    )
}

@Composable
private fun VeritasApp() {
    val api = remember { VeritasApi() }
    var loggedIn by remember { mutableStateOf(false) }
    var selected by remember { mutableStateOf<Document?>(null) }
    MaterialTheme {
        Surface(modifier = Modifier.fillMaxSize(), color = Ink) {
            if (!loggedIn) LoginScreen { email, password, onError ->
                api.login(email, password).onSuccess { loggedIn = true }.onFailure { onError(it.message.orEmpty()) }
            } else if (selected != null) {
                EditorScreen(api, selected!!) { selected = null }
            } else {
                LibraryScreen(api) { selected = it }
            }
        }
    }
}

@Composable
private fun LoginScreen(onLogin: (String, String, (String) -> Unit) -> Unit) {
    var email by remember { mutableStateOf("student@veritas.io") }
    var password by remember { mutableStateOf("student123") }
    var error by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()
    Column(modifier = Modifier.fillMaxSize().padding(28.dp), verticalArrangement = Arrangement.Center) {
        Text("VERITAS", color = Mint, style = MaterialTheme.typography.labelLarge, fontWeight = FontWeight.Bold)
        Text("Write with a record of the work.", color = Color.White, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(28.dp))
        OutlinedTextField(email, { email = it }, label = { Text("Email") }, modifier = Modifier.fillMaxWidth())
        Spacer(Modifier.height(12.dp))
        OutlinedTextField(password, { password = it }, label = { Text("Password") }, visualTransformation = PasswordVisualTransformation(), modifier = Modifier.fillMaxWidth())
        Spacer(Modifier.height(18.dp))
        Button(onClick = { scope.launch { onLogin(email, password) { error = it } } }, modifier = Modifier.fillMaxWidth()) { Text("Sign in") }
        if (error.isNotBlank()) Text(error, color = Color(0xFFFFB4AB), modifier = Modifier.padding(top = 12.dp))
    }
}

@Composable
private fun LibraryScreen(api: VeritasApi, onOpen: (Document) -> Unit) {
    var documents by remember { mutableStateOf<List<Document>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf("") }
    LaunchedEffect(Unit) {
        api.documents().onSuccess { documents = it }.onFailure { error = it.message.orEmpty() }
        loading = false
    }
    Column(modifier = Modifier.fillMaxSize().padding(20.dp)) {
        Text("Your workspace", color = Color.White, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
        Text("Return to a saved draft or submitted document.", color = Soft, modifier = Modifier.padding(top = 6.dp, bottom = 20.dp))
        if (loading) CircularProgressIndicator(color = Mint)
        if (error.isNotBlank()) Text(error, color = Color(0xFFFFB4AB))
        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(documents) { document ->
                Card(colors = CardDefaults.cardColors(containerColor = Color(0xFF102033)), modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Text(document.title, color = Color.White, fontWeight = FontWeight.Bold)
                        Text(document.status.replaceFirstChar { it.uppercase() }, color = Mint, modifier = Modifier.padding(top = 5.dp))
                        Button(onClick = { onOpen(document) }, modifier = Modifier.padding(top = 12.dp)) { Text("Open document") }
                    }
                }
            }
        }
    }
}

@Composable
private fun EditorScreen(api: VeritasApi, initial: Document, onBack: () -> Unit) {
    var document by remember { mutableStateOf(initial) }
    var sourceUrl by remember { mutableStateOf("") }
    var message by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()
    Column(modifier = Modifier.fillMaxSize().padding(20.dp)) {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            OutlinedButton(onClick = onBack) { Text("Library") }
            Text("Draft workspace", color = Mint, modifier = Modifier.padding(top = 12.dp))
        }
        OutlinedTextField(document.title, { document = document.copy(title = it) }, label = { Text("Title") }, modifier = Modifier.fillMaxWidth().padding(top = 16.dp))
        OutlinedTextField(document.content, { document = document.copy(content = it) }, label = { Text("Write") }, modifier = Modifier.fillMaxWidth().weight(1f).padding(top = 12.dp))
        OutlinedTextField(sourceUrl, { sourceUrl = it }, label = { Text("Reference URL") }, modifier = Modifier.fillMaxWidth().padding(top = 12.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.padding(top = 12.dp)) {
            Button(onClick = { scope.launch { api.save(document, sourceUrl).onSuccess { document = it; sourceUrl = ""; message = "Saved and revision recorded" }.onFailure { message = it.message.orEmpty() } } }) { Text("Save") }
            Button(onClick = { scope.launch { api.seal(document).onSuccess { message = "Signed export ready" }.onFailure { message = it.message.orEmpty() } } }) { Text("Seal") }
        }
        if (message.isNotBlank()) Text(message, color = Mint, modifier = Modifier.padding(top = 10.dp))
    }
}
