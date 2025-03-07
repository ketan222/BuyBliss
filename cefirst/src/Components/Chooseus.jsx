import bag from "../assets/bag.svg"
import support from "../assets/support.svg"
import truck from "../assets/truck.svg"
import './Chooseus.css'
import chooseus from "../assets/picc4.jpg"
function Chooseus(){
    return(
        <div className="chooseus">
            <div className="left-choose">
                <div className="left-choose-top">
                    <h3 className="choose-heading">Why Choose Us</h3>
                    <p className="choose-para">Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate velit imperdiet dolor tempor tristique.</p>
                </div>
                <div className="left-choose-bottom">
                    <div className="truck-choose card">
                        <img src={truck} alt="" className="choose-img" />
                        <p className="left-choose-bottom-para1">Fast & Free Shipping</p>
                        <p className="left-choose-bottom-para2">Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate.</p>
                    </div>
                    <div className="bag-choose card">
                        <img src={bag} alt=""  className="choose-img"/>
                        <p className="left-choose-bottom-para1">Easy to Shop</p>
                        <p className="left-choose-bottom-para2">Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate.</p>
                    </div>
                    <div className="support-choose card ">
                        <img src={support} alt="" className="choose-img"/>
                        <p className="left-choose-bottom-para1">24/7 Support</p>
                        <p className="left-choose-bottom-para2">Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate.</p>
                    </div>
                </div>

            </div>
            <div className="right-choose">
                <img src={chooseus} alt="" className="right-choose-img"/>
            </div>
        </div>
    )
}
export default Chooseus