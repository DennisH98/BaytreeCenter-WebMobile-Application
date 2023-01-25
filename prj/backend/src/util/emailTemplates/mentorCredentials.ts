export function mentorCredentialsTemplate(username: string, password: string): string {
  return `
  <div>
    <h1>Welcome to the Baytree App!</h1>
    <p>If you are receiving this email, then an account has been created under your name.</p>
    <div>
      <h2>Your credentials for the app are as follows:</h2>
      <p>
        Username: ${username}<br>
        Password: ${password}
      </p>
    </div>
    <p>Please do not share this email with anyone.</p>
  </div>
  `;
}
