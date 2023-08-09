function CodeBlock ({ domCode }) {
  console.log('domCode value: ', domCode)
  return (
        <pre style={{
          fontSize: '14px',
          backgroundColor: '#000',
          color: '#05C1FF'
        }}>
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
  )
}

export default CodeBlock
