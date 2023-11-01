import React, { useEffect, useState } from 'react';
import '../Styles/EventForm.css';
import axios from "axios"
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';




function formatDate(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}




const EditForm = () => {
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState({
        eventName: '',
        eventDescription: '',
        registrationLink: '',
        registrationDate: '',
        closingDate: '',
        venue: '',
        organisation: '',
        modeOfConduction: '',
        errors: {},

        posterImage: null,
    });

    //fetch id from url
    const { id } = useParams();

    const validateForm = () => {
        const errors = {};
        const { eventName, eventDescription, registrationLink, registrationDate, closingDate, venue, organisation, posterImage, modeOfConduction } = formValues;

        if (!eventName) errors.eventName = 'Event Name is required';
        if (!eventDescription) errors.eventDescription = 'Event Description is required';
        if (!registrationLink) errors.registrationLink = 'Registration Link is required';
        if (!registrationDate) errors.registrationDate = 'Registration Date is required';
        if (!closingDate) errors.closingDate = 'Closing Date is required';
        if (!venue) errors.venue = 'Venue is required';
        if (!organisation) errors.organisation = 'Organisation is required';
        if (!posterImage) errors.posterImage = 'Poster Image is required';
        if (!modeOfConduction) errors.modeOfConduction = 'Mode of Conduction is required';

        setFormValues({ ...formValues, errors });
        return Object.keys(errors).length === 0;
    };

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/v1/getsingleevent/${id}`);
                const eventData = response.data.data; // Assuming the data key contains the event details

                setFormValues({
                    eventName: eventData.eventName,
                    eventDescription: eventData.eventDescription,
                    registrationLink: eventData.registrationLink,
                    registrationDate: formatDate(eventData.registrationDate),
                    closingDate:formatDate(eventData.closingDate),
                    venue: eventData.venue,
                    organisation: eventData.organisation,
                    modeOfConduction: eventData.modeOfConduction,
                    errors: { posterImage: null }, // Include any other error states as needed
                    posterImage: null // Consider how to handle the poster image data
                });
            } catch (error) {
                console.error('Error fetching event:', error);
                toast.error('Error fetching event');
            }
        };

        fetchEvent();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log(formValues);
            try {
                const response = await axios.post(`http://localhost:4000/api/v1/edit/${id}`, formValues, {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Set the appropriate content type for file uploads
                    },
                    withCredentials: true, // Include cookies in the request
                });

                console.log(response.data); // Handle the response as needed
                navigate("/events")

                toast.success('Event updated successfully');

            } catch (error) {
                toast.error('Error while editing the event');
                console.error('Error  the form:', error);
            }
            console.log('Form submitted successfully');
        }
    };


    const handlePosterImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (allowedTypes.includes(selectedFile.type)) {
                setFormValues({ ...formValues, posterImage: selectedFile });
            } else {
                setFormValues({
                    ...formValues,
                    errors: { ...formValues.errors, posterImage: 'Invalid file type. Please select a JPEG or PNG image.' },
                });
            }
        }
    };

    return (
        <div className="event-form-container">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            <div className="event-form">
                <h1 className="text-[40px] font-semibold text-center mb-7">Event Edit Form</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="eventName">Event Name *</label>
                        <input
                            type="text"
                            id="eventName"
                            value={formValues.eventName}
                            className='eventip'
                            onChange={(e) => setFormValues({ ...formValues, eventName: e.target.value })}
                        />
                        {formValues.errors.eventName && <p className="error">{formValues.errors.eventName}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="eventDescription">Event Description *</label>
                        <textarea
                            className='eventip'
                            id="eventDescription"
                            value={formValues.eventDescription}
                            onChange={(e) => setFormValues({ ...formValues, eventDescription: e.target.value })}
                        />
                        {formValues.errors.eventDescription && (
                            <p className="error">{formValues.errors.eventDescription}</p>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="posterImage">Event Poster *</label>
                        <input
                            className='eventip'
                            type="file"
                            id="posterImage"
                            name="posterImage"
                            accept=".jpeg, .jpg, .png"
                            onChange={handlePosterImageChange}
                        />
                        {formValues.errors.posterImage && (
                            <p className="error">{formValues.errors.posterImage}</p>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="registrationLink">Event Registration Link *</label>
                        <input
                            type="text"
                            className='eventip'
                            id="registrationLink"
                            value={formValues.registrationLink}
                            onChange={(e) => setFormValues({ ...formValues, registrationLink: e.target.value })}
                        />
                        {formValues.errors.registrationLink && (
                            <p className="error">{formValues.errors.registrationLink}</p>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="registrationDate">Registration Date *</label>
                        <input
                            type="date"
                            className='eventip'
                            id="registrationDate"
                            value={formValues.registrationDate}
                            onChange={(e) => setFormValues({ ...formValues, registrationDate: e.target.value })}
                        />
                        {formValues.errors.registrationDate && (
                            <p className="error">{formValues.errors.registrationDate}</p>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="closingDate">Closing Date *</label>
                        <input
                            type="date"
                            className='eventip'
                            id="closingDate"
                            value={formValues.closingDate}
                            onChange={(e) => setFormValues({ ...formValues, closingDate: e.target.value })}
                        />
                        {formValues.errors.closingDate && (
                            <p className="error">{formValues.errors.closingDate}</p>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="venue">Venue *</label>
                        <input
                            type="text"
                            id="venue"
                            className='eventip'
                            value={formValues.venue}
                            onChange={(e) => setFormValues({ ...formValues, venue: e.target.value })}
                        />
                        {formValues.errors.venue && <p className="error">{formValues.errors.venue}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="organisation">Organisation *</label>
                        <input
                            type="text"
                            id="organisation"
                            className='eventip'
                            value={formValues.organisation}
                            onChange={(e) => setFormValues({ ...formValues, organisation: e.target.value })}
                        />
                        {formValues.errors.organisation && (
                            <p className="error">{formValues.errors.organisation}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="modeOfConduction">Mode of Conduction *</label>
                        <input
                            type="text"
                            id="modeOfConduction"
                            className='eventip'
                            value={formValues.modeOfConduction}
                            onChange={(e) => setFormValues({ ...formValues, modeOfConduction: e.target.value })}
                        />
                        {formValues.errors.modeOfConduction && (
                            <p className="error">{formValues.errors.modeOfConduction}</p>
                        )}
                    </div>
                    <div className="form-group">
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditForm;
