/**
 * Button for users auth choice
 * @component
 * @param {prop} onClick - This select or deselect an auth choice"
 * @return - Reusable button for auth choices
 */
function Button ({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>
}

export default Button
