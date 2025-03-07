import Hero from "../Components/Hero"
import Chooseus from "../Components/Chooseus"
import Footer from "../Components/Footer"
import { tData } from "../TestimonialData"
import Testimonial from "../Components/Testimonial"
import Analysis from "../Components/Analysis"
function About(){
    return(
        <>
            <Hero heading="We sell only Trusted Items"/>
            <Analysis/>
            <Chooseus/>
            {/* <Testimonial tData ={tData}/> */}
            <Footer/>
        </>
    )
}
export default About