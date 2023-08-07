import { useState, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import * as prettier from "https://unpkg.com/prettier@3.0.1/standalone.mjs";
import prettierPluginBabel from "https://unpkg.com/prettier@3.0.1/plugins/babel.mjs";
import prettierPluginEstree from "https://unpkg.com/prettier@3.0.1/plugins/estree.mjs";

const initalOptions = {
  options: [
    {
      id: 1,
      option: 'Passkey',
    },
    {
      id: 2,
      option: 'Google',
    },
  ],
};

async function getCardJSX(active, options) {
  const jsxCode = ReactDOMServer.renderToStaticMarkup(
    <Card active={active} options={options} />
  );

  try {
    const formattedCode = await prettier.format(jsxCode, {
      parser: 'babel',
      plugins: [prettierPluginBabel, prettierPluginEstree],
    });
    console.log(formattedCode);
    return formattedCode;
  } catch (error) {
    console.error(error);
    return jsxCode;
  }
}

// Rest of the code remains unchanged...

function App() {
  const [isActive, setIsActive] = useState(false);
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
    <>
      <div className="container d-flex">
        {/* Left Flex */}
        <div className="container">
          <h2>Choose your Auth</h2>
          <ItemList options={options} onClick={handleClick} />
        </div>
        {/* Right Flex */}
        {/* Code Block Starts Here */}
        <pre style={{ fontSize: '14px', backgroundColor: '#f0f0f0' }}>
          {domCode}
        </pre>
        {/* Card Starts here */}
        <div className="container">
          <Card active={isActive} options={options} />
        </div>
      </div>
    </>
  );
}

// ... Rest of the components remain unchanged...


function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}

function Card({ active, options }) {
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
        {active && <ItemList options={options} />}
      </div>
    </div>
  );
}

function Item({ option, onClick }) {
  return <Button onClick={onClick}>{option.option}</Button>;
}

function ItemList({ options, onClick }) {
  return (
    // display items clicked within the list
    <ul>
      {options.options.map((option) => (
        <Item option={option} onClick={onClick} key={option.id} />
      ))}
    </ul>
  );
}

const MyComponent = () => {
  return (
    <div className="card" style={{ width: '18rem' }}>
      <div className="card-body">
        <h5 className="card-title">Signup/Login</h5>
        <div className="mb-3">
          <label htmlFor="exampleFormControlInput1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleFormControlInput2"
            placeholder="name@example.com"
          />
        </div>
        <label htmlFor="inputPassword5" className="form-label">
          Password
        </label>
        <input
          type="password"
          id="inputPassword6"
          className="form-control"
          aria-describedby="passwordHelpBlock"
        />
        <ul>
          <li>
            <button>Passkey</button>
          </li>
          <li>
            <button>Google</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default App;
