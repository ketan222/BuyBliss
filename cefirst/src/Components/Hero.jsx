import './Hero.css'
import couch from '../assets/couch.png'
import dotslight from '../assets/dotslight.svg'
function Hero(props){
    let heading = props.heading
    return(
        <div className="hero">
            <div className="left-hero">
                <div className="hero-heading">
                    {heading}
                </div>
                <div className="hero-para">
                    <p className='hero-para-1'>Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate velit imperdiet dolor tempor tristique.</p>
                </div>
                <div className="hero-btns">
                    <button className='shop-now-btn'>Shop now</button>
                    <button className='explore-now-btn'>Explore</button>
                </div>
            </div>
            <div className="right-hero">
                <img src={couch} alt="" className='couch-img' />
                <img src={dotslight} alt="" className='dots-light' />
            </div>
        </div>
    )
}
export default Hero