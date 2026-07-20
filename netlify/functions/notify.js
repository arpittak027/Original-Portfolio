const { Resend } = require('resend');

// IMPORTANT: Replace 're_xxxxxxxxx' with your actual Resend API Key
const resend = new Resend('DbWnkHnC_6VNSeRUm9a2VV6n1x89qCWc');

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { time, country, city, browser, device, referrer, ip } = data;

    // Construct the email HTML using the visitor data
    const htmlBody = `
      <h2>Someone clicked your "Available for Work" button! 🎉</h2>
      <p>Here are the visitor's details:</p>
      <ul>
        <li><strong>Time:</strong> ${time || 'N/A'}</li>
        <li><strong>Country:</strong> ${country || 'N/A'}</li>
        <li><strong>City:</strong> ${city || 'N/A'}</li>
        <li><strong>Browser:</strong> ${browser || 'N/A'}</li>
        <li><strong>Device:</strong> ${device || 'N/A'}</li>
        <li><strong>Referrer:</strong> ${referrer || 'Direct/None'}</li>
        <li><strong>IP Address:</strong> ${ip || 'N/A'}</li>
      </ul>
    `;

    // Send the email using the Resend SDK logic you provided
    const { data: responseData, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'takarpit777@gmail.com',
      subject: 'Someone visited your portfolio!',
      html: htmlBody
    });

    if (error) {
      console.error("Resend API Error:", error);
      return {
        statusCode: 400,
        body: JSON.stringify({ error }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Notification sent successfully", data: responseData }),
    };
  } catch (error) {
    console.error("Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
