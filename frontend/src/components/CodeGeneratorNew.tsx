import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { t } from '@/i18n/russian';
import {
  Code,
  Copy,
  Download,
  Settings,
  RefreshCw,
  FileCode,
  Terminal,
  Smartphone,
  Globe,
  Database,
  Server,
  CheckCircle
} from 'lucide-react';
import { Editor } from '@monaco-editor/react';
import toast from 'react-hot-toast';

interface CodeGeneratorProps {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: any;
  auth?: {
    type: 'bearer' | 'basic' | 'api-key';
    token?: string;
    username?: string;
    password?: string;
    key?: string;
    value?: string;
    location?: 'header' | 'query';
  };
}

const CodeGenerator = ({ method, url, headers = {}, body, auth }: CodeGeneratorProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('javascript');
  const [selectedLibrary, setSelectedLibrary] = useState<string>('fetch');
  const [showSettings, setShowSettings] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>('');

  const languages = [
    {
      id: 'javascript',
      name: 'JavaScript',
      icon: <FileCode className="w-4 h-4" />,
      libraries: ['fetch', 'axios', 'jquery', 'xhr']
    },
    {
      id: 'python',
      name: 'Python',
      icon: <Code className="w-4 h-4" />,
      libraries: ['requests', 'urllib', 'httpx', 'aiohttp']
    },
    {
      id: 'curl',
      name: 'cURL',
      icon: <Terminal className="w-4 h-4" />,
      libraries: ['basic', 'verbose']
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      icon: <Server className="w-4 h-4" />,
      libraries: ['http', 'https', 'axios', 'node-fetch']
    },
    {
      id: 'php',
      name: 'PHP',
      icon: <Globe className="w-4 h-4" />,
      libraries: ['curl', 'file_get_contents', 'guzzle', 'http_client']
    },
    {
      id: 'java',
      name: 'Java',
      icon: <Database className="w-4 h-4" />,
      libraries: ['okhttp', 'apache', 'java11', 'spring']
    },
    {
      id: 'csharp',
      name: 'C#',
      icon: <Database className="w-4 h-4" />,
      libraries: ['httpclient', 'restsharp', 'webclient']
    },
    {
      id: 'swift',
      name: 'Swift',
      icon: <Smartphone className="w-4 h-4" />,
      libraries: ['urlsession', 'alamofire']
    },
    {
      id: 'kotlin',
      name: 'Kotlin',
      icon: <Smartphone className="w-4 h-4" />,
      libraries: ['okhttp', 'ktor', 'retrofit']
    },
    {
      id: 'go',
      name: 'Go',
      icon: <Code className="w-4 h-4" />,
      libraries: ['net/http', 'fasthttp', 'resty']
    },
    {
      id: 'ruby',
      name: 'Ruby',
      icon: <Code className="w-4 h-4" />,
      libraries: ['net/http', 'httparty', 'faraday', 'rest-client']
    },
    {
      id: 'rust',
      name: 'Rust',
      icon: <Code className="w-4 h-4" />,
      libraries: ['reqwest', 'hyper', 'ureq']
    }
  ];

  const currentLanguage = languages.find(lang => lang.id === selectedLanguage);

  // Генерация кода при изменении параметров
  useEffect(() => {
    if (selectedLanguage && selectedLibrary) {
      const code = generateCode(selectedLanguage, selectedLibrary);
      setGeneratedCode(code);
    }
  }, [selectedLanguage, selectedLibrary, method, url, headers, body, auth]);

  const generateCode = (language: string, library: string): string => {
    // Подготавливаем заголовки с аутентификацией
    const finalHeaders = { ...headers };
    
    if (auth) {
      switch (auth.type) {
        case 'bearer':
          if (auth.token) {
            finalHeaders['Authorization'] = `Bearer ${auth.token}`;
          }
          break;
        case 'basic':
          if (auth.username && auth.password) {
            const credentials = btoa(`${auth.username}:${auth.password}`);
            finalHeaders['Authorization'] = `Basic ${credentials}`;
          }
          break;
        case 'api-key':
          if (auth.key && auth.value && auth.location === 'header') {
            finalHeaders[auth.key] = auth.value;
          }
          break;
      }
    }

    // Подготавливаем URL с API ключом в query параметрах
    let finalUrl = url;
    if (auth?.type === 'api-key' && auth.location === 'query' && auth.key && auth.value) {
      const urlObj = new URL(url);
      urlObj.searchParams.set(auth.key, auth.value);
      finalUrl = urlObj.toString();
    }

    switch (language) {
      case 'javascript':
        return generateJavaScript(library, method, finalUrl, finalHeaders, body);
      case 'python':
        return generatePython(library, method, finalUrl, finalHeaders, body);
      case 'curl':
        return generateCurl(library, method, finalUrl, finalHeaders, body);
      case 'nodejs':
        return generateNodeJS(library, method, finalUrl, finalHeaders, body);
      case 'php':
        return generatePHP(library, method, finalUrl, finalHeaders, body);
      case 'java':
        return generateJava(library, method, finalUrl, finalHeaders, body);
      case 'csharp':
        return generateCSharp(library, method, finalUrl, finalHeaders, body);
      case 'swift':
        return generateSwift(library, method, finalUrl, finalHeaders, body);
      case 'kotlin':
        return generateKotlin(library, method, finalUrl, finalHeaders, body);
      case 'go':
        return generateGo(library, method, finalUrl, finalHeaders, body);
      case 'ruby':
        return generateRuby(library, method, finalUrl, finalHeaders, body);
      case 'rust':
        return generateRust(library, method, finalUrl, finalHeaders, body);
      default:
        return '// Выберите язык программирования';
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      toast.success('Код скопирован в буфер обмена');
    } catch (error) {
      toast.error('Ошибка копирования');
    }
  };

  const downloadCode = () => {
    const extension = getFileExtension(selectedLanguage);
    const filename = `api_request.${extension}`;
    
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Код сохранен как ${filename}`);
  };

  const getFileExtension = (language: string): string => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      python: 'py',
      curl: 'sh',
      nodejs: 'js',
      php: 'php',
      java: 'java',
      csharp: 'cs',
      swift: 'swift',
      kotlin: 'kt',
      go: 'go',
      ruby: 'rb',
      rust: 'rs'
    };
    return extensions[language] || 'txt';
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Code className="w-5 h-5 mr-2" />
            Генерация кода
          </h3>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-1 px-3 py-1.5 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors text-sm"
            >
              <Copy className="w-4 h-4" />
              <span>Копировать</span>
            </button>
            
            <button
              onClick={downloadCode}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Скачать</span>
            </button>
          </div>
        </div>

        {/* Language Selection */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {languages.map((language) => (
            <button
              key={language.id}
              onClick={() => {
                setSelectedLanguage(language.id);
                setSelectedLibrary(language.libraries[0]);
              }}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedLanguage === language.id
                  ? 'bg-primary-100 text-primary-700 border-2 border-primary-300'
                  : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
              }`}
            >
              {language.icon}
              <span className="font-medium">{language.name}</span>
            </button>
          ))}
        </div>

        {/* Library Selection */}
        {currentLanguage && currentLanguage.libraries.length > 1 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 font-medium">Библиотека:</span>
            <select
              value={selectedLibrary}
              onChange={(e) => setSelectedLibrary(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {currentLanguage.libraries.map((lib) => (
                <option key={lib} value={lib}>
                  {lib}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                const code = generateCode(selectedLanguage, selectedLibrary);
                setGeneratedCode(code);
                toast.success('Код обновлен');
              }}
              className="flex items-center space-x-1 px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors text-sm"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Обновить</span>
            </button>
          </div>
        )}
      </div>

      {/* Code Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={getMonacoLanguage(selectedLanguage)}
          value={generatedCode}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            wordWrap: 'on',
            lineNumbers: 'on',
            folding: true,
            copyWithSyntaxHighlighting: true
          }}
          theme="vs"
        />
      </div>
    </div>
  );
};

// Функции генерации кода для разных языков

const generateJavaScript = (library: string, method: string, url: string, headers: Record<string, string>, body: any): string => {
  const hasBody = body && ['POST', 'PUT', 'PATCH'].includes(method);
  
  switch (library) {
    case 'fetch':
      return `fetch('${url}', {
  method: '${method}',${Object.keys(headers).length > 0 ? `
  headers: ${JSON.stringify(headers, null, 2)},` : ''}${hasBody ? `
  body: ${typeof body === 'object' ? 'JSON.stringify(' + JSON.stringify(body, null, 2) + ')' : `'${body}'`}` : ''}
})
.then(response => {
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  return response.json();
})
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`;

    case 'axios':
      return `const axios = require('axios');

const config = {
  method: '${method.toLowerCase()}',
  url: '${url}',${Object.keys(headers).length > 0 ? `
  headers: ${JSON.stringify(headers, null, 2)},` : ''}${hasBody ? `
  data: ${typeof body === 'object' ? JSON.stringify(body, null, 2) : `'${body}'`}` : ''}
};

axios(config)
.then(response => console.log(response.data))
.catch(error => console.error('Error:', error));`;

    case 'jquery':
      return `$.ajax({
  url: '${url}',
  method: '${method}',${Object.keys(headers).length > 0 ? `
  headers: ${JSON.stringify(headers, null, 2)},` : ''}${hasBody ? `
  data: ${typeof body === 'object' ? JSON.stringify(body) : `'${body}'`},
  contentType: 'application/json',` : ''}
  success: function(data) {
    console.log(data);
  },
  error: function(xhr, status, error) {
    console.error('Error:', error);
  }
});`;

    case 'xhr':
      return `const xhr = new XMLHttpRequest();
xhr.open('${method}', '${url}');

${Object.entries(headers).map(([key, value]) => `xhr.setRequestHeader('${key}', '${value}');`).join('\n')}

xhr.onload = function() {
  if (xhr.status >= 200 && xhr.status < 300) {
    console.log(JSON.parse(xhr.responseText));
  } else {
    console.error('Error:', xhr.statusText);
  }
};

xhr.onerror = function() {
  console.error('Request failed');
};

${hasBody ? `xhr.send(${typeof body === 'object' ? `'${JSON.stringify(body)}'` : `'${body}'`});` : 'xhr.send();'}`;

    default:
      return generateJavaScript('fetch', method, url, headers, body);
  }
};

const generatePython = (library: string, method: string, url: string, headers: Record<string, string>, body: any): string => {
  const hasBody = body && ['POST', 'PUT', 'PATCH'].includes(method);
  
  switch (library) {
    case 'requests':
      return `import requests
import json

url = "${url}"
${Object.keys(headers).length > 0 ? `headers = ${JSON.stringify(headers, null, 2).replace(/"/g, "'")}` : ''}
${hasBody ? `data = ${typeof body === 'object' ? JSON.stringify(body, null, 2).replace(/"/g, "'") : `'${body}'`}` : ''}

response = requests.${method.toLowerCase()}(url${Object.keys(headers).length > 0 ? ', headers=headers' : ''}${hasBody ? (typeof body === 'object' ? ', json=data' : ', data=data') : ''})

if response.status_code == 200:
    print(response.json())
else:
    print(f"Error: {response.status_code} - {response.text}")`;

    case 'urllib':
      return `import urllib.request
import urllib.parse
import json

url = "${url}"
${hasBody ? `data = ${typeof body === 'object' ? JSON.stringify(body).replace(/"/g, "'") : `'${body}'`}` : ''}
${hasBody ? `data = json.dumps(data).encode('utf-8') if isinstance(data, dict) else data.encode('utf-8')` : ''}

req = urllib.request.Request(url${hasBody ? ', data=data' : ''}, method='${method}')
${Object.entries(headers).map(([key, value]) => `req.add_header('${key}', '${value}')`).join('\n')}

try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        print(result)
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code} - {e.reason}")
except Exception as e:
    print(f"Error: {e}")`;

    case 'httpx':
      return `import httpx
import asyncio

async def make_request():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.${method.toLowerCase()}(
                "${url}",${Object.keys(headers).length > 0 ? `
                headers=${JSON.stringify(headers, null, 2).replace(/"/g, "'")},` : ''}${hasBody ? `
                ${typeof body === 'object' ? 'json=' : 'data='}${typeof body === 'object' ? JSON.stringify(body, null, 2).replace(/"/g, "'") : `'${body}'`}` : ''}
            )
            response.raise_for_status()
            print(response.json())
        except httpx.HTTPError as e:
            print(f"HTTP error: {e}")
        except Exception as e:
            print(f"Error: {e}")

asyncio.run(make_request())`;

    default:
      return generatePython('requests', method, url, headers, body);
  }
};

const generateCurl = (library: string, method: string, url: string, headers: Record<string, string>, body: any): string => {
  const hasBody = body && ['POST', 'PUT', 'PATCH'].includes(method);
  let cmd = `curl -X ${method}`;
  
  if (library === 'verbose') {
    cmd += ' -v';
  }
  
  cmd += ` "${url}"`;

  Object.entries(headers).forEach(([key, value]) => {
    cmd += ` \\\n  -H "${key}: ${value}"`;
  });

  if (hasBody) {
    if (typeof body === 'object') {
      cmd += ` \\\n  -d '${JSON.stringify(body)}'`;
    } else {
      cmd += ` \\\n  -d '${body}'`;
    }
  }

  return cmd;
};

const generateNodeJS = (library: string, method: string, url: string, headers: Record<string, string>, body: any): string => {
  const hasBody = body && ['POST', 'PUT', 'PATCH'].includes(method);
  
  switch (library) {
    case 'http':
    case 'https':
      const protocol = url.startsWith('https') ? 'https' : 'http';
      return `const ${protocol} = require('${protocol}');
const url = require('url');

const parsedUrl = url.parse('${url}');

const options = {
  hostname: parsedUrl.hostname,
  port: parsedUrl.port,
  path: parsedUrl.path,
  method: '${method}',
  headers: ${JSON.stringify(headers, null, 2)}
};

const req = ${protocol}.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log(result);
    } catch (e) {
      console.log(data);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

${hasBody ? `req.write(${typeof body === 'object' ? `'${JSON.stringify(body)}'` : `'${body}'`});` : ''}
req.end();`;

    case 'node-fetch':
      return `const fetch = require('node-fetch');

fetch('${url}', {
  method: '${method}',${Object.keys(headers).length > 0 ? `
  headers: ${JSON.stringify(headers, null, 2)},` : ''}${hasBody ? `
  body: ${typeof body === 'object' ? 'JSON.stringify(' + JSON.stringify(body, null, 2) + ')' : `'${body}'`}` : ''}
})
.then(response => {
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  return response.json();
})
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`;

    default:
      return generateNodeJS('node-fetch', method, url, headers, body);
  }
};

const generatePHP = (library: string, method: string, url: string, headers: Record<string, string>, body: any): string => {
  const hasBody = body && ['POST', 'PUT', 'PATCH'].includes(method);
  
  switch (library) {
    case 'curl':
      return `<?php
$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => '${url}',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => '${method}',${Object.keys(headers).length > 0 ? `
  CURLOPT_HTTPHEADER => array(
${Object.entries(headers).map(([key, value]) => `    '${key}: ${value}'`).join(',\n')}
  ),` : ''}${hasBody ? `
  CURLOPT_POSTFIELDS => ${typeof body === 'object' ? `'${JSON.stringify(body)}'` : `'${body}'`},` : ''}
));

$response = curl_exec($curl);

if (curl_errno($curl)) {
    echo 'Error: ' . curl_error($curl);
} else {
    echo $response;
}

curl_close($curl);
?>`;

    case 'guzzle':
      return `<?php
require_once 'vendor/autoload.php';

use GuzzleHttp\\Client;
use GuzzleHttp\\Exception\\RequestException;

$client = new Client();

try {
    $response = $client->request('${method}', '${url}', [${Object.keys(headers).length > 0 ? `
        'headers' => ${JSON.stringify(headers, null, 2).replace(/"/g, "'")},` : ''}${hasBody ? `
        'json' => ${typeof body === 'object' ? JSON.stringify(body, null, 2).replace(/"/g, "'") : `'${body}'`}` : ''}
    ]);
    
    echo $response->getBody();
} catch (RequestException $e) {
    echo 'Error: ' . $e->getMessage();
}
?>`;

    default:
      return generatePHP('curl', method, url, headers, body);
  }
};

const generateJava = (library: string, method: string, url: string, headers: Record<string, string>, body: any): string => {
  const hasBody = body && ['POST', 'PUT', 'PATCH'].includes(method);
  
  switch (library) {
    case 'okhttp':
      return `import okhttp3.*;
import java.io.IOException;

public class ApiRequest {
    public static void main(String[] args) throws IOException {
        OkHttpClient client = new OkHttpClient();
        
        ${hasBody ? `MediaType mediaType = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(mediaType, "${typeof body === 'object' ? JSON.stringify(body).replace(/"/g, '\\"') : body}");
        ` : ''}
        Request request = new Request.Builder()
            .url("${url}")
            .method("${method}", ${hasBody ? 'body' : 'null'})${Object.entries(headers).map(([key, value]) => `
            .addHeader("${key}", "${value}")`).join('')}
            .build();
        
        try (Response response = client.newCall(request).execute()) {
            System.out.println(response.body().string());
        }
    }
}`;

    default:
      return generateJava('okhttp', method, url, headers, body);
  }
};

const generateCSharp = (library: string, method: string, url: string, headers: Record<string, string>, body: any): string => {
  const hasBody = body && ['POST', 'PUT', 'PATCH'].includes(method);
  
  switch (library) {
    case 'httpclient':
      return `using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

class Program
{
    static async Task Main(string[] args)
    {
        using (HttpClient client = new HttpClient())
        {
            ${Object.entries(headers).map(([key, value]) => `client.DefaultRequestHeaders.Add("${key}", "${value}");`).join('\n            ')}
            
            try
            {
                ${hasBody ? `var content = new StringContent("${typeof body === 'object' ? JSON.stringify(body).replace(/"/g, '\\"') : body}", Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.${method.charAt(0).toUpperCase() + method.slice(1).toLowerCase()}Async("${url}", content);` : `HttpResponseMessage response = await client.${method.charAt(0).toUpperCase() + method.slice(1).toLowerCase()}Async("${url}");`}
                
                response.EnsureSuccessStatusCode();
                string responseBody = await response.Content.ReadAsStringAsync();
                Console.WriteLine(responseBody);
            }
            catch (HttpRequestException e)
            {
                Console.WriteLine($"Error: {e.Message}");
            }
        }
    }
}`;

    default:
      return generateCSharp('httpclient', method, url, headers, body);
  }
};

const generateSwift = (library: string, method: string, url: string, headers: Record<string, string>, body: any): string => {
  const hasBody = body && ['POST', 'PUT', 'PATCH'].includes(method);
  
  return `import Foundation

let url = URL(string: "${url}")!
var request = URLRequest(url: url)
request.httpMethod = "${method}"

${Object.entries(headers).map(([key, value]) => `request.setValue("${value}", forHTTPHeaderField: "${key}")`).join('\n')}

${hasBody ? `let bodyData = """
${typeof body === 'object' ? JSON.stringify(body, null, 2) : body}
""".data(using: .utf8)!
request.httpBody = bodyData` : ''}

let task = URLSession.shared.dataTask(with: request) { (data, response, error) in
    if let error = error {
        print("Error: \\(error)")
        return
    }
    
    guard let data = data else {
        print("No data received")
        return
    }
    
    do {
        let json = try JSONSerialization.jsonObject(with: data, options: [])
        print(json)
    } catch {
        print("JSON parsing error: \\(error)")
    }
}

task.resume()`;
};

const generateKotlin = (library: string, method: string, url: string, headers: Record<string, string>, body: any): string => {
  return `// Kotlin code generation not implemented yet`;
};

const generateGo = (library: string, method: string, url: string, headers: Record<string, string>, body: any): string => {
  const hasBody = body && ['POST', 'PUT', 'PATCH'].includes(method);
  
  return `package main

import (
    "fmt"
    "io"
    "net/http"
    ${hasBody ? '"strings"' : ''}
)

func main() {
    url := "${url}"
    
    ${hasBody ? `payload := strings.NewReader(\`${typeof body === 'object' ? JSON.stringify(body) : body}\`)
    
    req, err := http.NewRequest("${method}", url, payload)` : `req, err := http.NewRequest("${method}", url, nil)`}
    
    if err != nil {
        fmt.Println("Error creating request:", err)
        return
    }
    
    ${Object.entries(headers).map(([key, value]) => `req.Header.Add("${key}", "${value}")`).join('\n    ')}
    
    client := &http.Client{}
    res, err := client.Do(req)
    if err != nil {
        fmt.Println("Error making request:", err)
        return
    }
    defer res.Body.Close()
    
    body, err := io.ReadAll(res.Body)
    if err != nil {
        fmt.Println("Error reading response:", err)
        return
    }
    
    fmt.Println(string(body))
}`;
};

const generateRuby = (library: string, method: string, url: string, headers: Record<string, string>, body: any): string => {
  const hasBody = body && ['POST', 'PUT', 'PATCH'].includes(method);
  
  return `require 'net/http'
require 'uri'
require 'json'

uri = URI('${url}')
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true if uri.scheme == 'https'

request = Net::HTTP::${method.charAt(0).toUpperCase() + method.slice(1).toLowerCase()}.new(uri)
${Object.entries(headers).map(([key, value]) => `request['${key}'] = '${value}'`).join('\n')}

${hasBody ? `request.body = ${typeof body === 'object' ? `'${JSON.stringify(body)}'` : `'${body}'`}` : ''}

begin
  response = http.request(request)
  puts response.body
rescue => e
  puts "Error: #{e.message}"
end`;
};

const generateRust = (library: string, method: string, url: string, headers: Record<string, string>, body: any): string => {
  return `// Rust code generation not implemented yet`;
};

const getMonacoLanguage = (language: string): string => {
  const languageMap: Record<string, string> = {
    javascript: 'javascript',
    python: 'python',
    curl: 'shell',
    nodejs: 'javascript',
    php: 'php',
    java: 'java',
    csharp: 'csharp',
    swift: 'swift',
    kotlin: 'kotlin',
    go: 'go',
    ruby: 'ruby',
    rust: 'rust'
  };
  return languageMap[language] || 'text';
};

export default CodeGenerator;