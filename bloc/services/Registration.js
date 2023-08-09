// Registration.js

import { startRegistration } from '@simplewebauthn/browser'

// Function to start WebAuthn registration
async function startWebAuthnRegistration (constructedPayload) {
  console.log('constructed Payload: ', constructedPayload)
  /* Generate signup options for your user */
  try {
    // Serialize payload as query parameters
    const queryParams = new URLSearchParams(constructedPayload).toString()

    // Make the first GET request with the payload as query parameters
    const resp = await fetch(`/api/signup?${queryParams}`)
    const opts = await resp.json()

    // Start WebAuthn Registration
    let regResp
    try {
      regResp = await startRegistration(opts)
      if (regResp.transports) {
        if (regResp.transports.length === 2) {
          regResp.transports.pop(1)
        }
      }
    } catch (err) {
      if (err === undefined || typeof err === 'undefined') {
        console.log('err is undefined')
      }
      throw new Error(err)
    }

    /* Send response to server */
    const verificationResp = await fetch('/api/verify_signup', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(regResp)
    })

    // Report validation response
    const verificationRespJSON = await verificationResp.json()
    const { verified, msg } = verificationRespJSON
    if (verified) {
      /* Redirect to your "login required" page */
      // 4. EDIT this location to redirect the user to your login required page
      window.location = '/'
    } else {
      console.log('not authenticated')
    }
  } catch (err) {
    console.error('Error during WebAuthn registration:', err)
  }
}

// Export the function to be called from PasskeyButton
export { startWebAuthnRegistration }
