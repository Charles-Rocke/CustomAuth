import 'bootstrap/dist/css/bootstrap.css'
import { startWebAuthnRegistration } from '../services/Registration'
import { useState } from 'react'
/**
 * This button initiates Passkey Signup
 * @component
 * @param {type} name - Description
 * @return {jsx} - Signup with Passkey
 */
function PasskeyButton ({ signinActive, onClick, id, email }) {
  const [loginActive, setLoginActive] = useState(false) // Start with "false" state

  const handleSigninActive = () => {
    setLoginActive(true) // Set loginActive to "true" on the first click
    startWebAuthnRegistration() // Call the function to start WebAuthn registration
    onClick(true) // Toggle state to "true" after the service is triggered
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
