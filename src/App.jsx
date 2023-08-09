import { useState, useEffect } from 'react'
import ReactDOMServer from 'react-dom/server'
import * as prettier from 'https://unpkg.com/prettier@3.0.1/standalone.mjs'
import prettierPluginBabel from 'https://unpkg.com/prettier@3.0.1/plugins/babel.mjs'
import prettierPluginEstree from 'https://unpkg.com/prettier@3.0.1/plugins/estree.mjs'

import AuthList from './AuthList'
import Card from './Card'
import CodeBlock from './CodeBlock'

/**
 * Set initial auth choices for user
 */
const initalOptions = [
  {
    id: 1,
    option: 'Passkey'
  }
]

/**
 * Retrieves JSX for users Card component and formats it
 * @function
 * @param {boolean} active - The state of the UI
 * @param {object} options - The auth options chosen by the user
 * @return - Successfully formatted code or an error
 */
async function getCardJSX (passkeyActive, options) {
  /**
   * This is the JSX that will refelct the users Auth Card
   */
  const jsxCode = ReactDOMServer.renderToStaticMarkup(
    <Card passkeyActive={passkeyActive} options={options} />
  )

  try {
    /**
      * This formats the code generated from gpt
      */
    const formattedCode = await prettier.format(jsxCode, {
      parser: 'babel',
      plugins: [prettierPluginBabel, prettierPluginEstree]
    })
    return formattedCode
  } catch (error) {
    return error
  }
}

/**
 * This sends code to be converted to JSX
 * @function
 * @param {string} domeCode - This is the code to be converted
 * @return - Successfully generated code or an error
 */
async function sendPostRequest (domCode) {
  try {
    /**
      * This sends the code to the API
      */
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/generate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ domCode })
      }
    )

    /**
      * This handles success and errors from code send
      */
    if (response.ok) {
      // Parse the JSON response if successful
      const responseData = await response.json()
      console.log('Post request successful:', responseData)
      return responseData
    } else {
      console.error('Post request failed:', response.statusText)
      return null
    }
  } catch (error) {
    console.error('Error sending post request:', error)
    return null
  }
}

// Rest of the code remains unchanged...

/**
 * This manages the entire app state and layout
 * @component
 * @return - The app Layout
 */
function App () {
  const [passkeyActive, setPasskeyActive] = useState(false) // Passkey choice for the user
  const [options, setOptions] = useState(initalOptions) // Default auth choices for the user
  const [domCode, setDomCode] = useState(null) // Code for the users AuthCard

  /**
   * This handles when the user chooses Passkey
   * @function
   */
  function handlePasskeyClick () {
    setPasskeyActive(!passkeyActive) // The user can select and deselect
  }

  /**
   * This updates the code block as user makes choices and retrieves jsx that reflects users
   */
  useEffect(() => {
    async function updateDomCodeAndCallApi () {
      if (passkeyActive) {
        const jsxCode = await getCardJSX(passkeyActive, options)

        sendPostRequest(jsxCode).then((responseData) => {
          if (responseData && responseData.message.content) {
            setDomCode(responseData.message.content)
          }
        })
      }
    }

    updateDomCodeAndCallApi()
  }, [passkeyActive, options])

  /**
   * Returns the app layout
   */
  return (
    <>
      <div className="container d-flex">
        {/* Choose Auth Section */}
        <div className="container">
          <h2>Choose your Auth</h2>
          <AuthList options={options} onPasskeyClick={handlePasskeyClick} />
        </div>
        <CodeBlock domCode={domCode} />
        {/* Users Card Section */}
        <div className="container">
          <Card passkeyActive={passkeyActive} options={options} />
        </div>
      </div>
    </>
  )
}

/**
 * export the App component
 */
export default App
