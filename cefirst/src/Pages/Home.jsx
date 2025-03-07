import Chooseus from "../Components/Chooseus"
import Hero from "../Components/Hero"
import Interior from "../Components/Interior"
import Footer from "../Components/Footer"
import Testimonial from "../Components/Testimonial"
import { tData } from "../TestimonialData"
import Analysis from "../Components/Analysis"
function Home(){
    return(
        <>
            <Hero  
            heading="Modern Interior Design Studio"
            />
            {/* <Analysis/> */}
            <Chooseus/>
            <Interior/>
            {/* <Testimonial tData={tData}/> */}
            <Footer/>
        </>
    )
}
export default Home