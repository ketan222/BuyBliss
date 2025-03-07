import './Interior.css'
import grid1 from "../assets/picc5.jpg"
// import grid2 from "../assets/grid2.jpg"
// import grid3 from "../assets/grid3.jpg"
function Interior(){
    return(
        <div className="interior">
            <div className="interior-left">
                <img src={grid1} alt=""  className='grid1'/>
            </div>
            <div className="interior-right">
                <h3 className='interiror-right-para1'>You can find best fashion cloths on our site</h3>
                <p className='interiror-right-para2'>Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate velit imperdiet dolor tempor tristique. Pellentesque habitant morbi tristique senectus et netus et malesuada</p>
                <div className="list-interior">
                    <ul>
                        <li>Donec vitae odio quis nisl dapibus malesuada</li>
                        <li>Donec vitae odio quis nisl dapibus malesuada</li>
                    </ul>
                    <ul>
                        <li>Donec vitae odio quis nisl dapibus malesuada</li>
                        <li>Donec vitae odio quis nisl dapibus malesuada</li>
                    </ul>
                </div>
                <button className='explore-interior'>Explore</button>
            </div>
        </div>
    )
}
export default Interior