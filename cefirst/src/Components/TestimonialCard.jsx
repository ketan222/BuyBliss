import person_1 from "../assets/person_1.jpg"
import './TestimonialCard.css'
function TestimonialCard(props){
    let tData = props.tData;
    return(
        <div className="testimonial-card"> 
            <h3 className="heading-test">Testimonials</h3>
            <div className="image">
                <img src={tData.image} alt="" className="image-testimonial"/>
            </div>
            <div className="info">
                <p className="test-name">{tData.name}</p>
                <p className="test-job">{tData.job}</p>
                <p className="test-des">{tData.des}</p>
            </div>
        </div>
    )
}
export default TestimonialCard;