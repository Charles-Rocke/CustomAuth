import 'bootstrap/dist/css/bootstrap.css'
import { startWebAuthnRegistration } from '../services/Registration'
import { useState } from 'react'
/**
 * This button initiates Passkey Signup
 * @component
 * @param {type} name - Description
 * @return {jsx} - Signup with Passkey
 */
function PasskeyButton ({ signinActive, onClick, id, payload }) {
  const [loginActive, setLoginActive] = useState(false) // Start with "false" state

  const handleSigninActive = async () => {
    setLoginActive(true) // Set loginActive to "true" on the first click
    // Destructure payload values
    const { apiKey, domain, domainName, email } = payload

    // Construct the payload
    const constructedPayload = {
      api_key: apiKey,
      domain,
      domain_name: domainName,
      user_email: email
    }

    // Call the startWebAuthnRegistration function and pass the constructed payload
    await startWebAuthnRegistration(constructedPayload)
    setLoginActive(!loginActive) // Toggle state to "true" after the service is triggered
  }

  return (
    <button
      id={id}
      onClick={handleSigninActive} // Use the handleSigninActive function
      className="btn btn-primary"
    >
      Sign in with Passkey
    </button>

  )
}

export default PasskeyButton
