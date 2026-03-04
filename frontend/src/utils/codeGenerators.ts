import type { HttpRequest } from '@/types';

export interface CodeGenerator {
  name: string;
  language: string;
  extension: string;
  generate: (request: HttpRequest) => string;
}

const escapeString = (str: string) => str.replace(/"/g, '\\"').replace(/\n/g, '\\n');

export const codeGenerators: CodeGenerator[] = [
  {
    name: 'JavaScript (fetch)',
    language: 'javascript',
    extension: 'js',
    generate: (request) => {
      const hasBody = request.body && ['POST', 'PUT', 'PATCH'].includes(request.method);
      
      let code = `const url = "${request.url}";\n\n`;
      
      if (Object.keys(request.headers).length > 0) {
        code += `const headers = {\n`;
        Object.entries(request.headers).forEach(([key, value]) => {
          code += `  "${key}": "${value}",\n`;
        });
        code += `};\n\n`;
      }
      
      if (hasBody) {
        code += `const body = ${JSON.stringify(request.body, null, 2)};\n\n`;
      }
      
      code += `const response = await fetch(url, {\n`;
      code += `  method: "${request.method}",\n`;
      
      if (Object.keys(request.headers).length > 0) {
        code += `  headers,\n`;
      }
      
      if (hasBody) {
        code += `  body: JSON.stringify(body),\n`;
      }
      
      code += `});\n\n`;
      code += `const data = await response.json();\n`;
      code += `console.log(data);`;
      
      return code;
    }
  },
  
  {
    name: 'JavaScript (axios)',
    language: 'javascript', 
    extension: 'js',
    generate: (request) => {
      let code = `import axios from 'axios';\n\n`;
      
      code += `const config = {\n`;
      code += `  method: '${request.method.toLowerCase()}',\n`;
      code += `  url: '${request.url}',\n`;
      
      if (Object.keys(request.headers).length > 0) {
        code += `  headers: {\n`;
        Object.entries(request.headers).forEach(([key, value]) => {
          code += `    '${key}': '${value}',\n`;
        });
        code += `  },\n`;
      }
      
      if (request.body && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
        code += `  data: ${JSON.stringify(request.body, null, 4)},\n`;
      }
      
      code += `};\n\n`;
      code += `try {\n`;
      code += `  const response = await axios(config);\n`;
      code += `  console.log(response.data);\n`;
      code += `} catch (error) {\n`;
      code += `  console.error(error);\n`;
      code += `}`;
      
      return code;
    }
  },

  {
    name: 'Python (requests)',
    language: 'python',
    extension: 'py',
    generate: (request) => {
      let code = `import requests\nimport json\n\n`;
      
      code += `url = "${request.url}"\n\n`;
      
      if (Object.keys(request.headers).length > 0) {
        code += `headers = {\n`;
        Object.entries(request.headers).forEach(([key, value]) => {
          code += `    "${key}": "${value}",\n`;
        });
        code += `}\n\n`;
      }
      
      if (request.body && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
        code += `data = ${JSON.stringify(request.body, null, 4)}\n\n`;
      }
      
      code += `response = requests.${request.method.toLowerCase()}(\n`;
      code += `    url,\n`;
      
      if (Object.keys(request.headers).length > 0) {
        code += `    headers=headers,\n`;
      }
      
      if (request.body && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
        if (request.headers['content-type']?.includes('application/json')) {
          code += `    json=data,\n`;
        } else {
          code += `    data=data,\n`;
        }
      }
      
      code += `)\n\n`;
      code += `print(f"Status Code: {response.status_code}")\n`;
      code += `print(f"Response: {response.json()}")`;
      
      return code;
    }
  },

  {
    name: 'cURL',
    language: 'bash',
    extension: 'sh',
    generate: (request) => {
      let code = `curl -X ${request.method} \\\n`;
      code += `  "${request.url}"`;
      
      Object.entries(request.headers).forEach(([key, value]) => {
        code += ` \\\n  -H "${key}: ${value}"`;
      });
      
      if (request.body && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
        code += ` \\\n  -d '${escapeString(request.body)}'`;
      }
      
      return code;
    }
  },

  {
    name: 'Node.js (http)',
    language: 'javascript',
    extension: 'js',
    generate: (request) => {
      const url = new URL(request.url);
      const hasBody = request.body && ['POST', 'PUT', 'PATCH'].includes(request.method);
      
      let code = `const http = require('${url.protocol === 'https:' ? 'https' : 'http'}');\n\n`;
      
      code += `const options = {\n`;
      code += `  hostname: '${url.hostname}',\n`;
      code += `  port: ${url.port || (url.protocol === 'https:' ? 443 : 80)},\n`;
      code += `  path: '${url.pathname}${url.search}',\n`;
      code += `  method: '${request.method}',\n`;
      
      if (Object.keys(request.headers).length > 0) {
        code += `  headers: {\n`;
        Object.entries(request.headers).forEach(([key, value]) => {
          code += `    '${key}': '${value}',\n`;
        });
        code += `  },\n`;
      }
      
      code += `};\n\n`;
      
      if (hasBody) {
        code += `const postData = ${JSON.stringify(request.body)};\n\n`;
      }
      
      code += `const req = http.request(options, (res) => {\n`;
      code += `  console.log('Status Code:', res.statusCode);\n`;
      code += `  res.on('data', (chunk) => {\n`;
      code += `    console.log(chunk.toString());\n`;
      code += `  });\n`;
      code += `});\n\n`;
      
      if (hasBody) {
        code += `req.write(postData);\n`;
      }
      
      code += `req.end();`;
      
      return code;
    }
  },

  {
    name: 'Go',
    language: 'go',
    extension: 'go',
    generate: (request) => {
      let code = `package main\n\n`;
      code += `import (\n`;
      code += `    "fmt"\n`;
      code += `    "net/http"\n`;
      code += `    "io/ioutil"\n`;
      
      const hasBody = request.body && ['POST', 'PUT', 'PATCH'].includes(request.method);
      if (hasBody) {
        code += `    "strings"\n`;
      }
      
      code += `)\n\n`;
      code += `func main() {\n`;
      
      if (hasBody) {
        code += `    body := strings.NewReader(\`${request.body}\`)\n`;
        code += `    req, err := http.NewRequest("${request.method}", "${request.url}", body)\n`;
      } else {
        code += `    req, err := http.NewRequest("${request.method}", "${request.url}", nil)\n`;
      }
      
      code += `    if err != nil {\n`;
      code += `        panic(err)\n`;
      code += `    }\n\n`;
      
      Object.entries(request.headers).forEach(([key, value]) => {
        code += `    req.Header.Set("${key}", "${value}")\n`;
      });
      
      code += `\n    client := &http.Client{}\n`;
      code += `    resp, err := client.Do(req)\n`;
      code += `    if err != nil {\n`;
      code += `        panic(err)\n`;
      code += `    }\n`;
      code += `    defer resp.Body.Close()\n\n`;
      code += `    body, err := ioutil.ReadAll(resp.Body)\n`;
      code += `    if err != nil {\n`;
      code += `        panic(err)\n`;
      code += `    }\n\n`;
      code += `    fmt.Println(string(body))\n`;
      code += `}`;
      
      return code;
    }
  }
];