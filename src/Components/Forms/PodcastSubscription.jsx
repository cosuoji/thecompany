import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import ElegantButton from '../Buttons/ElegantButton';

function PodcastSubscriptionForm() {
  const [state, handleSubmit] = useForm("xeokgazj");
  if (state.succeeded) {
    return <p>Thanks for Subscribing!</p>;
  }

  return (
<form
  onSubmit={handleSubmit}
  className="flex flex-col lg:flex-row lg:flex-nowrap gap-6 w-full"
>
  {/* Inputs container: grows */}
  <div className="flex flex-col lg:flex-row gap-4 flex-1">
    <input
      type="text"
      name="firstName"
      placeholder="First Name"
      className="px-3 py-2 rounded border border-[#4B371C] flex-1"
    />
    <input
      type="text"
      name="lastName"
      placeholder="Last Name"
      className="px-3 py-2 rounded border border-[#4B371C] flex-1"
    />
    <input
      type="email"
      name="email"
      placeholder="Email Address"
      className="px-3 py-2 rounded border border-[#4B371C] flex-1"
    />
      <div className="flex justify-center sm:-m-4 py-4 lg:justify-center px-4">
          <ElegantButton 
              label={state.submitting ? 'Subscribing...' : 'Subscribe'}
              state={state.submitting}
          />
      </div>
  </div>


</form>

  );
}

export default PodcastSubscriptionForm;
