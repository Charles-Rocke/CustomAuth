import Auth from './Auth'
/**
 * The list of auth options
 * @component
 * @param {string} option - This is the name of an auth option
 * @param {string} onPasskeyClick - This tells if user chose Passkey
 * @return {ul} - This will list the auth options
 */
function AuthList ({ options, onPasskeyClick }) {
  return (
      <ul>
        {options.map((option) => (
          <Auth option={option} key={option.id} onPasskeyClick={onPasskeyClick} />
        ))}
      </ul>
  )
}

export default AuthList
