import React, { useState } from 'react';
import { z } from 'zod';
import './App.css';

const schema = z.object({
  firstName: z.string().min(3, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  address: z.string().optional(),
  paymentDetails: z.string()
    .regex(/@/, "Payment details must contain '@'")
});

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    paymentDetails: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const result = schema.safeParse(formData);
    if (!result.success) {
      // Map Zod errors to form errors
      const zodErrors = result.error.format();
      const formattedErrors = Object.keys(zodErrors).reduce((acc, key) => {
        if (zodErrors[key]?._errors) {
          acc[key] = zodErrors[key]._errors[0];
        }
        return acc;
      }, {});
      return formattedErrors;
    }
    return {};
  };

  const handleSubmit = e => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="container">
      <h1>Multi-Step Form</h1>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div>
              <h2>Personal Details</h2>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && <p className="error">{errors.firstName}</p>}
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>
          )}
          {step === 2 && (
            <div>
              <h2>Address Details</h2>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          )}
          {step === 3 && (
            <div>
              <h2>Payment Details</h2>
              <input
                type="text"
                name="paymentDetails"
                placeholder="UPI id"
                value={formData.paymentDetails}
                onChange={handleChange}
              />
              {errors.paymentDetails && <p className="error">{errors.paymentDetails}</p>}
            </div>
          )}
          {step > 1 && <button type="button" onClick={prevStep}>Previous</button>}
          {step < 3 && <button type="button" onClick={nextStep}>Next</button>}
          {step === 3 && <button type="submit">Submit</button>}
        </form>
      ) : (
        <div>
          <h2>Submitted Details</h2>
          <p><strong>First Name:</strong> {formData.firstName}</p>
          <p><strong>Last Name:</strong> {formData.lastName}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Address:</strong> {formData.address}</p>
          <p><strong>Payment Details:</strong> {formData.paymentDetails}</p>
        </div>
      )}
    </div>
  );
}

export default App;
