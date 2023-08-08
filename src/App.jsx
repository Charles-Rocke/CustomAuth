import { useState, useEffect } from 'react'
import ReactDOMServer from 'react-dom/server'
import * as prettier from 'https://unpkg.com/prettier@3.0.1/standalone.mjs'
import prettierPluginBabel from 'https://unpkg.com/prettier@3.0.1/plugins/babel.mjs'
import prettierPluginEstree from 'https://unpkg.com/prettier@3.0.1/plugins/estree.mjs'

const initalOptions = [
  {
    id: 1,
    option: 'Passkey'
  },
  {
    id: 2,
    option: 'Google'
  }
]

async function getCardJSX (active, options) {
  // Generate JSX code from React components
  const jsxCode = ReactDOMServer.renderToStaticMarkup(
    <Card active={active} options={options} />
  )

  try {
    // Format the JSX code using Prettier
    const formattedCode = await prettier.format(jsxCode, {
      parser: 'babel',
      plugins: [prettierPluginBabel, prettierPluginEstree]
    })
    console.log(formattedCode)
    return formattedCode
  } catch (error) {
    console.error(error)
    return jsxCode
  }
}

// send original dom code to be converted to JSX
async function sendPostRequest (domCode) {
  try {
    // Send a POST request to the API with domCode as JSON payload
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

function App () {
  const [isActive, setIsActive] = useState(false)
  const [options, setOptions] = useState(initalOptions)
  const [domCode, setDomCode] = useState('')

  // Helper methods
  async function handleClick () {
    setIsActive(!isActive)

    // Call sendPostRequest and set domCode based on the response
    const code = await sendPostRequest(domCode)
    if (code !== null) {
      setDomCode(code.message.content)
    }
  }

  useEffect(() => {
    // Generate and set formatted JSX code when isActive or options change
    getCardJSX(isActive, options).then((formattedCode) => {
      setDomCode(formattedCode)
    })
  }, [isActive, options])

  function handlePasskeyClick () {
    // Update options for the Passkey button
    const updatedOptions = {
      options: [
        {
          id: 1,
          option: 'Passkey'
        }
      ]
    }
    setOptions(updatedOptions)
  }

  return (
    <>
      <div className="container d-flex">
        {/* Left Flex */}
        <div className="container">
          <h2>Choose your Auth</h2>
          <AuthList options={options} onClick={handleClick} />
        </div>
        {/* Right Flex */}
        {/* Code Block Starts Here */}
        <pre style={{ fontSize: '14px', backgroundColor: '#f0f0f0' }}>
          {/* Show formatted JSX code if domCode is available */}
          {domCode
            ? `const [isActive, setIsActive] = useState(false);
  const [options, setOptions] = useState(initalOptions);
  const [domCode, setDomCode] = useState('');

  // Helper methods
  function handleClick() {
    setIsActive(!isActive);
  }

  useEffect(() => {
    getCardJSX(isActive, options).then((formattedCode) => {
      setDomCode(formattedCode);
    });
  }, [isActive, options]);

  function handlePasskeyClick() {
    const updatedOptions = {
      options: [
        {
          id: 1,
          option: 'Passkey',
        },
      ],
    };
    setOptions(updatedOptions);
  }

  return (
    ${domCode} 
  )`
            : ''}
        </pre>
        {/* Card Starts here */}
        <div className="container">
          <Card active={isActive} options={options} />
        </div>
      </div>
    </>
  )
}

// ... Rest of the components remain unchanged...

function Button ({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>
}

/*

*/
function Card ({ active, options }) {
  return (
    // Default Layout
    <div className="card" style={{ width: '18rem' }}>
      <div className="card-body">
        <h5 className="card-title">Signup/Login</h5>
        {/* Email */}
        <div className="mb-3">
          <label htmlFor="exampleFormControlInput1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="name@example.com"
          />
        </div>
        {/* password */}
        <label htmlFor="inputPassword5" className="form-label">
          Password
        </label>
        <input
          type="password"
          id="inputPassword5"
          className="form-control"
          aria-describedby="passwordHelpBlock"
        />
        {/* if user clicks Passkey, display passkey option in card */}
        {active && <AuthList options={options} />}
      </div>
    </div>
  )
}

function Auth ({ option, onClick }) {
  return <Button onClick={onClick}>{option.option}</Button>
}

function AuthList ({ options, onClick }) {
  console.log(options)
  return (
    // display Auths clicked within the list
    <ul>
      {options.options.map((option) => (
        <Auth option={option} onClick={onClick} key={option.id} />
      ))}
    </ul>
  )
}

export default App
