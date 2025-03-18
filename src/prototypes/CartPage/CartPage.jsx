import "./CartPage.scss";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

//Components
import Breadcrumbs from "../../components/CourseTemplates/Breadcrumbs/Breadcrumbs";
import Notice from "../../components/Panels/Notice/Notice";
import CartPageHeader from "../../components/CourseTemplates/CartPageHeader/CartPageHeader";
import SidebarLayout from '../../components/Navigation/Sidebar/SidebarLayout/SidebarLayout';
import PageLayout from "../../components/Layout/PageLayout/PageLayout";
import ButtonIconLarge  from "../../components/Atoms/Buttons/ButtonIconLarge/ButtonIconLarge";
import Modal from "../../components/GeneralTemplates/Modal/Modal";
import OfferingFooterCardPage from "../../components/CourseTemplates/Offerings/OfferingFooterCardPage/OfferingFooterCardPage";
import OfferingHeader from "../../components/CourseTemplates/Offerings/OfferingHeader/OfferingHeader";
import OfferingMeetingTimes from "../../components/CourseTemplates/Offerings/OfferingMeetingTimes/OfferingMeetingTimes";
import OfferingDetails from "../../components/CourseTemplates/Offerings/OfferingDetails/OfferingDetails";
import CartPageSubTotal from "../../components/CourseTemplates/CartPageSubTotal/CartPageSubTotal";

//Assets
import { arrowForward } from '../../assets/icons';
import TextLink from "../../components/Navigation/TextLink/TextLink";

const CartPage = () => {
  
  //Receives # of courses added to cart from the CoursePage
  const location = useLocation()
  const {offeringsAddedToCart = [], courseDetails = {}} = location.state || {};
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [subtotal, setSubtotal] = useState(null)
  const [crnInCart, setCrnInCart ] = useState(offeringsAddedToCart)
  const [isCheckboxChecked, setIsCheckboxChecked] = useState([false])
 
  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }
  
  //Calculates course total when page loads
  useEffect(() => {
    const calculateCourseSubtotal = () => {
      let courseSubtotal = 0;
      crnInCart.forEach((course) => {
      if (!course.domestic_fee) console.log('domestic fee is not available');
        else {courseSubtotal += course.domestic_fee};
      });
      setSubtotal(Math.round((courseSubtotal + Number.EPSILON) * 100) / 100) //Rounds the number to 2 decimal 
    }
    calculateCourseSubtotal()
  }, [crnInCart]) //calculate if offeringsInCart changes

  // Toggle overflow on body when modal is open/closed
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  const handleDeleteBtnClick = (crn) => {
    const updatedCart = crnInCart.filter(offering =>  
      offering.crn !== crn
    )
    setCrnInCart(updatedCart)
  }

  const handleCheckboxCheck = (event) => {
    setIsCheckboxChecked(prev => [...prev, event.target.checked])
    console.log(isCheckboxChecked)
  }

return (
  <>
    {isModalOpen && <Modal closeModal={closeModal}/>}
    <PageLayout>
    <div className={`cartPage ${isModalOpen && 'overflowHidden'}`}>
    <div className="bg-darkBlue">
      <Breadcrumbs />
    </div>
    <div className="bg-darkBlue">
      <CartPageHeader
        title="Cart"
      />
    </div>
    
    <div className="cartPage__contentArea">
      <SidebarLayout />
      <div className="cartPage__contentArea-main">
        <Notice
          heading="International Fees"
          descr="International fees are typically 3.12 times the domestic tuition. Exact cost will be calculated upon completion of registration."
          type="info"
        />
        {crnInCart.length !== 0 
        ? <>
            <h2 className="heading2">
              {`You have ${crnInCart.length} ${crnInCart.length > 1 ? "courses" : "course"} in your cart`}
            </h2>
            <p>You will be registered in the following course offering(s) immediately upon log-in to the BCIT Student Information System. Prior to registration, please ensure that you have read the notes on each course for which you are registering.
            </p>
            <div className="cartPage__offerings">
              <CartPageSubTotal 
                offeringsInCart={crnInCart}
                subtotal={subtotal}
              />
              <div className="cartPage__offerings-list">
                {crnInCart.map((offering, index) => {
                  return (
                    <div className="cartPage__offerings__container" key={index}>
                      <div className='cartPage__offerings__header'>
                        <h2>{`${courseDetails.crn} - ${courseDetails.title}`}</h2>
                        <div>
                          <h4 className="descr__title">Prerequisite(s)</h4>
                          <ul>
                            {courseDetails.overview.prereq.map((prereq, index) => {
                              return <li key={index}>{prereq}</li>
                            })}
                          </ul>
                        </div>
                      </div>
                      <div className='cartPage__offerings-details'>
                        <OfferingHeader 
                          offeringDetails={offering}
                        />
                        <OfferingMeetingTimes 
                          meetingMetrics={offering.meeting_metrics}
                        />
                        <OfferingDetails 
                            offeringDetails={offering} 
                          />
                        <OfferingFooterCardPage 
                          handleBtnClick={handleDeleteBtnClick}
                          courseDetailsCrn={offering.crn}
                          isCheckboxChecked={isCheckboxChecked}
                          handleCheckboxCheck={handleCheckboxCheck}
                        /> 
                      </div>
                    </div>
                  )
                })}
              </div>
              <CartPageSubTotal 
                offeringsInCart={crnInCart}
                subtotal={subtotal}
              />
              <div className='cartPage__offerings__btn-container'>
                <ButtonIconLarge  
                  label="Continue to Registration"
                  handleBtnClick={openModal}
                  icon={arrowForward}
                  type='primary'
                /> 
              </div>
            </div>
          </> 
        
        : <>
            <h2 className="heading2">
              Your cart is empty
            </h2>
            <div>There are currently no courses in your cart. <TextLink text="Find Flexible Learning courses that may interest you."/>
            </div>
          </>
        }
      </div>
      
    </div>

  </div>
  </PageLayout>
  </>
  
  
);
};

export default CartPage;
