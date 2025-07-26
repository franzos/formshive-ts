export function exampleFormHtml(formUrl: string, checkChallenge = false, challengeUrl = '') {
  let captchaWidget = '';
  if (checkChallenge && challengeUrl) {
    captchaWidget = `  <br/><altcha-widget
    challengeurl=${challengeUrl}
    hidefooter
    hidelogo
  ></altcha-widget><br>
`;
  }

  return `<form action="${formUrl}" method="POST" enctype="application/x-www-form-urlencoded">
  <label for="email">Email:</label><br>
  <input type="email" id="email" name="email" value="your-email@gmail.com"><br>
  <label for="name">Name:</label><br>
  <input type="text" id="name" name="name" value="Mike"><br>
  <label for="message">Message:</label><br>
  <textarea id="message" name="message">Hi, I want to enquire about ....</textarea><br>
  <label for="products">Send me more info about:</label><br>
  <input type="checkbox" id="productA" name="products[]" value="Product A">
  <label for="productA">Product A</label><br>
  <input type="checkbox" id="productB" name="products[]" value="Product B">
  <label for="productB">Product B</label><br>
  <input type="checkbox" id="productC" name="products[]" value="Product C">
  <label for="productC">Product C</label><br>
${captchaWidget}  <input type="submit" value="Submit">
</form>
`;
}

export function exampleFormHtmlFileUpload(
  formUrl: string,
  checkChallenge = false,
  challengeUrl = ''
) {
  let captchaWidget = '';
  if (checkChallenge && challengeUrl) {
    captchaWidget = `  <br/><altcha-widget
    challengeurl=${challengeUrl}
    hidefooter
    hidelogo
  ></altcha-widget><br>
`;
  }

  return `<form action="${formUrl}" method="POST" enctype="multipart/form-data">
  <label for="email">Email:</label><br>
  <input type="email" id="email" name="email" value="your-email@gmail.com"><br>
  <label for="name">Name:</label><br>
  <input type="text" id="name" name="name" value="Mike"><br>
  <label for="message">Message:</label><br>
  <textarea id="message" name="message">Hi, I want to enquire about ....</textarea><br>
  <label for="products">Send me more info about:</label><br>
  <input type="checkbox" id="productA" name="products[]" value="Product A">
  <label for="productA">Product A</label><br>
  <input type="checkbox" id="productB" name="products[]" value="Product B">
  <label for="productB">Product B</label><br>
  <input type="checkbox" id="productC" name="products[]" value="Product C">
  <label for="productC">Product C</label><br>
  <label for="file">File:</label><br>
  <input type="file" id="file" name="file"><br>
${captchaWidget}  <input type="submit" value="Submit">
</form>
`;
}

export function exampleFormHtmlSimple(formUrl: string) {
  return `<form action="${formUrl}" method="POST">
  <label for="email">Email:</label><br>
  <input type="email" id="email" name="email" value="your-email@gmail.com"><br>
  <label for="name">Name:</label><br>
  <input type="text" id="name" name="name" value="Mike"><br>
  <label for="message">Message:</label><br>
  <textarea id="message" name="message">Hi, I want to enquire about ....</textarea><br>
  <input type="submit" value="Submit">
</form>
`;
}

export function exampleFormHtmlSimpleWithCaptcha(formUrl: string, challengeUrl: string) {
  return `<form action="${formUrl}" method="POST">
  <label for="email">Email:</label><br>
  <input type="email" id="email" name="email" required value="your-email@gmail.com"><br>
  <label for="name">Name:</label><br>
  <input type="text" id="name" name="name" required value="Mike"><br>
  <label for="message">Message:</label><br>
  <textarea id="message" name="message" required>Hi, I want to enquire about ....</textarea><br>
  <altcha-widget
    challengeurl=${challengeUrl}
  ></altcha-widget>
  <input type="submit" value="Submit">
</form>
`;
}

export function exampleCurlForm(formUrl: string) {
  return `curl -X POST \\
  -d "email=your-email@gmail.com" \\
  -d "name=Mike" \\
  -d "message=Hi, I want to enquire about ...." \\
  -d "products[]=Product A" \\
  -d "products[]=Product B" \\
  ${formUrl}?redirect=none`;
}

export function exampleCurlMulitpart(formUrl: string) {
  return `curl -X POST \\
  -H "Content-Type: multipart/form-data" \\
  -F "email=your-email@gmail.com" \\
  -F "name=Mike" \\
  -F "message=Hi, I want to enquire about ...." \\
  -F "products[]=Product A" \\
  -F "products[]=Product B" \\
  -F "file=@/some-folder/my-picture.jpg" \\
  ${formUrl}?redirect=none`;
}

export function exampleCurlJson(formUrl: string) {
  return `curl -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"email":"your-email@gmail.com","name":"Mike","message":"Hi, I want to enquire about ....","products":["Product A","Product B"]}' \\
  ${formUrl}?redirect=none`;
}

export function exampleLLMPrompt(formUrl: string, checkChallenge = false, challengeUrl = '') {
  let captchaInstructions = '';
  if (checkChallenge && challengeUrl) {
    captchaInstructions = `

Include a captcha widget using the following HTML code:
    
  <altcha-widget
    challengeurl=${challengeUrl}
    hidefooter
    hidelogo
  ></altcha-widget>
  
IMPORTANT: For the captcha to work, you must include this script tag in the HTML head:
  <script async defer src="https://cdn.jsdelivr.net/npm/altcha/dist/altcha.min.js" type="module"></script>

`;
  }

  return `Generate a HTML form with following fields:
  - email: required
  - name: required
  - message: required
  - products: optional, multiple checkboxes (Product A, Product B, Product C)
  
and a button to submit ("Send").${captchaInstructions}
POST to the following URL: ${formUrl}`;
}
