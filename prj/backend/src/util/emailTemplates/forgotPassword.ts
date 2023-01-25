export function forgotPasswordTemplate(name: string, resetPasswordLink: string): string {
  return `
    <div>
      <h2>Reset Password Request</h2>
      <p>
        Hi ${name}, we've received a request to change your password for the Baytree App. If you would like to reset your password, please click the following link:
      </p>
      <a href="${resetPasswordLink}">${resetPasswordLink}</a>
      <p>This link will expire in 1 hour.</p>
    </div>
  `;
}
