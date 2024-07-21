
export default function Loader() {
    return (
        <div classname='loader-container' >
            <img 
                src={require('../Assets/logo.png')} 
                alt='Loading...' 
            />
        </div>
    )
}

