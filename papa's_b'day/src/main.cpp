#include <WiFi.h>
#include <WebServer.h>
#include <DNSServer.h>
#include <LittleFS.h>

const char* ssid = "🎂 Papa Birthday 🎂";
const char* password = "";

WebServer server(80);
DNSServer dnsServer;

const byte DNS_PORT = 53;

String getContentType(String filename)
{
    if(filename.endsWith(".html")) return "text/html";
    if(filename.endsWith(".css")) return "text/css";
    if(filename.endsWith(".js")) return "application/javascript";
    if(filename.endsWith(".png")) return "image/png";
    if(filename.endsWith(".jpeg")) return "image/jpeg";
    if(filename.endsWith(".jpeg")) return "image/jpeg";
    if(filename.endsWith(".gif")) return "image/gif";
    if(filename.endsWith(".svg")) return "image/svg+xml";
    if(filename.endsWith(".mp3")) return "audio/mpeg";
    return "text/plain";
}

bool handleFile(String path)
{
    if(path.endsWith("/"))
        path += "index.html";

    if(LittleFS.exists(path))
    {
        File file = LittleFS.open(path, "r");

        server.streamFile(file, getContentType(path));

        file.close();

        return true;
    }

    return false;
}

void setup()
{
    Serial.begin(1000000);

    LittleFS.begin(true);

    WiFi.mode(WIFI_AP);

    WiFi.softAP(ssid, password);

    IPAddress IP = WiFi.softAPIP();

    Serial.println(IP);

    dnsServer.start(DNS_PORT, "*", IP);

    server.onNotFound([]()
    {
        if(!handleFile(server.uri()))
        {
            File file = LittleFS.open("/index.html","r");

            server.streamFile(file,"text/html");

            file.close();
        }
    });

    server.begin();

    Serial.println("Server Started");
}

void loop()
{
    dnsServer.processNextRequest();

    server.handleClient();
}