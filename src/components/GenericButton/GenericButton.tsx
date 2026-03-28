import style from './GenericButton.module.css'

export type ButtonProps = {
  buttonText: string
} & React.ComponentProps<'button'>

const GenericButton = ({onClick, buttonText, type='button', disabled, className}:ButtonProps) => {
  const customClass = className? className : style.button 

  return (
    <button type={type} onClick={onClick} className={customClass} disabled= {disabled}>
      {buttonText}
    </button>
  );
};

export default GenericButton;
