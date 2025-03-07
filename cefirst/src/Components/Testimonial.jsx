import { useState } from "react"
import { tData } from "../TestimonialData"
import TestimonialCard from "./TestimonialCard"
import { IoIosArrowDropleft } from "react-icons/io";
import { IoIosArrowDropright } from "react-icons/io";
import "./Testimonial.css"
function Testimonial(props){
    let tData = props.tData
    const[index,setIndex] = useState(1);
    function plusClickHandler(){
        if(index + 1 >3){
            setIndex(0)
        }
        else setIndex(index + 1)
    }
    function minusClickHandler(){
        if(index -1 < 0){
            setIndex(3)
        }
        else setIndex(index-1)
    }
    return(
        <>
            <TestimonialCard tData = {tData[index]}/>
            <div className="icons-test">
                <IoIosArrowDropleft onClick={minusClickHandler} className="arrow-left"/>
                <IoIosArrowDropright onClick={plusClickHandler} className="arrow-right"/>
            </div>
        </>
    )   
}
export default Testimonial