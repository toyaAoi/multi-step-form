import { useState } from "react";
import "./App.css";
import "./mobile.css";
import { arcade, advanced, pro, thankYou } from "./assets/icon.js";

export default function App() {
  const [stepNum, setStepNum] = useState(0);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dataValidationStatus, setDataValidationStatus] = useState({
    username: {
      isEmpty: true,
      isValid: true,
      tried: false,
    },
    email: {
      isEmpty: true,
      isValid: false,
      tried: false,
    },
    phone: {
      isEmpty: true,
      isValid: false,
      tried: false,
    },
  });

  const [plan, setPlan] = useState(0);
  const [yearly, setYearly] = useState(false);
  const [addons, setAddons] = useState([false, false, false]);

  const [filled, setFilled] = useState(false);

  return (
    <div className="container">
      <Sidebar stepNum={stepNum} />

      {/*--- FORM ---*/}
      {!filled ? (
        <Form
          stepNum={stepNum}
          setStepNum={setStepNum}
          username={username}
          setUsername={setUsername}
          email={email}
          setEmail={setEmail}
          phone={phone}
          setPhone={setPhone}
          dataValidationStatus={dataValidationStatus}
          setDataValidationStatus={setDataValidationStatus}
          plan={plan}
          setPlan={setPlan}
          yearly={yearly}
          setYearly={setYearly}
          addons={addons}
          setAddons={setAddons}
          setFilled={setFilled}
        />
      ) : (
        <Submitted />
      )}
    </div>
  );
}

function Form({
  stepNum,
  setStepNum,
  username,
  setUsername,
  email,
  setEmail,
  phone,
  setPhone,
  dataValidationStatus,
  setDataValidationStatus,
  plan,
  setPlan,
  yearly,
  setYearly,
  addons,
  setAddons,

  setFilled,
}) {
  const alright =
    !dataValidationStatus.username.isEmpty &&
    dataValidationStatus.email.isValid &&
    dataValidationStatus.phone.isValid;

  function submit() {
    alright && setStepNum(stepNum + 1);

    const status = {
      ...dataValidationStatus,
    };

    for (let key in status) {
      status[key].tried = true;
    }

    setDataValidationStatus(status);
  }

  function stepBack() {
    setStepNum(stepNum - 1);
  }

  return (
    <form
      id="form"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      {/*--- Step 1 ---*/}

      {stepNum === 0 && (
        <PersonalInfo
          username={username}
          email={email}
          phone={phone}
          setUsername={setUsername}
          setEmail={setEmail}
          setPhone={setPhone}
          dataValidationStatus={dataValidationStatus}
          setDataValidationStatus={setDataValidationStatus}
        />
      )}

      {/*--- Step 2 --- */}
      {stepNum === 1 && (
        <SelectPlan
          plan={plan}
          setPlan={setPlan}
          yearly={yearly}
          setYearly={setYearly}
        />
      )}

      {/*--- Step 3 --- */}
      {stepNum === 2 && (
        <AddOns addons={addons} setAddons={setAddons} yearly={yearly} />
      )}

      {/*--- Step 4 --- */}
      {stepNum === 3 && (
        <Summery
          plan={plan}
          yearly={yearly}
          addons={addons}
          setStepNum={setStepNum}
        />
      )}

      <div
        id="buttons"
        style={stepNum === 0 ? { justifyContent: "flex-end" } : {}}
      >
        {stepNum > 0 && (
          <button className="step-back" onClick={() => stepBack()}>
            Go Back
          </button>
        )}
        {stepNum === 3 ? (
          <button
            type="submit"
            form="form"
            className="confirm"
            onClick={(e) => setFilled(true)}
          >
            Confirm
          </button>
        ) : (
          <button onClick={(e) => submit()}>Next Step</button>
        )}
      </div>
    </form>
  );
}

function PersonalInfo({
  username,
  email,
  phone,
  setUsername,
  setEmail,
  setPhone,
  dataValidationStatus,
  setDataValidationStatus,
}) {
  const status = {
    ...dataValidationStatus,
  };

  function handleUsername(username) {
    setUsername(username);

    status.username.isEmpty = username.length === 0;

    setDataValidationStatus(status);
  }

  function handleEmail(email) {
    setEmail(email);

    const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    status.email.isEmpty = email.length === 0;
    status.email.isValid = emailRegex.test(email);

    setDataValidationStatus(status);
  }

  function handlePhone(phone) {
    setPhone(phone);

    const phoneRegex =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    status.phone.isEmpty = phone.length === 0;
    status.phone.isValid = phoneRegex.test(phone);

    setDataValidationStatus(status);
  }

  function handleBlur(input) {
    status[input].tried = true;
    setDataValidationStatus(status);
  }

  const inputFields = [
    {
      name: "Name",
      id: "username",
      type: "text",
      placeholder: "e.g. Stephen King",
      value: username,
      onChange: (e) => handleUsername(e.target.value),
    },
    {
      name: "Email Address",
      id: "email",
      type: "text",
      placeholder: "e.g. stephenking@lorem.com",
      value: email,
      onChange: (e) => handleEmail(e.target.value),
    },
    {
      name: "Phone Number",
      id: "phone",
      type: "number",
      placeholder: "e.g. +1 234 567 890",
      value: phone,
      onChange: (e) => handlePhone(e.target.value),
    },
  ];

  return (
    <div id="personal-info-form">
      <h1>Personal info</h1>
      <p className="form-info">
        Please provide your name, email address, and phone number.
      </p>

      {inputFields.map((input, i) => (
        <InputField
          key={i}
          {...input}
          dataStatus={dataValidationStatus[input.id]}
          onBlur={() => handleBlur(input.id)}
        />
      ))}
    </div>
  );
}

function InputField({
  name,
  id,
  dataStatus,
  type,
  placeholder,
  value,
  onChange,
  onBlur,
}) {
  const isEmpty = dataStatus.tried && dataStatus.isEmpty;
  const isInvalid = dataStatus.tried && !dataStatus.isValid;

  return (
    <>
      <label htmlFor={id}>
        <span>{name}</span>
        {(isEmpty && <span className="error">This field is required</span>) ||
          (isInvalid && (
            <span className="error">Must be a valid {name.toLowerCase()}</span>
          ))}
      </label>
      <input
        id={id}
        className={`${isEmpty ? "empty " : ""}${isInvalid ? "invalid " : ""}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onBlur={onBlur}
        onChange={onChange}
      />
    </>
  );
}

function SelectPlan({ plan, setPlan, yearly, setYearly }) {
  const plans = [
    {
      name: "Arcade",
      monthly: "$9/mo",
      yearly: "$90/yr",
      icon: arcade,
    },
    {
      name: "Advanced",
      monthly: "$12/mo",
      yearly: "$120/yr",
      icon: advanced,
    },
    {
      name: "Pro",
      monthly: "$15/mo",
      yearly: "$150/yr",
      icon: pro,
    },
  ];

  return (
    <div id="select-plan">
      <h1>Select your plan</h1>
      <p className="form-info">
        You have the option of monthly or yearly billing.
      </p>
      <div className="plans-container">
        {plans.map((pln, i) => (
          <div key={pln.name} className="card">
            <input
              type="radio"
              name="plan"
              id={pln.name}
              checked={i === plan}
              onChange={() => setPlan(i)}
            />
            <label htmlFor={pln.name} className="click">
              <img src={pln.icon} alt={pln.name} />
              <div>
                <p className="plan">{pln.name}</p>
                <p className="plan-price">
                  {yearly ? pln.yearly : pln.monthly}
                </p>
                {yearly && <p className="discount">2 months free</p>}
              </div>
            </label>
          </div>
        ))}
      </div>
      <label className="switch click">
        <input
          type="checkbox"
          name="plan-conversion"
          checked={yearly}
          onChange={() => setYearly(!yearly)}
        />
        <span className="mothly">Monthly </span>
        <span id="slider"></span>
        <span className="yearly"> Yearly</span>
      </label>
    </div>
  );
}

function AddOns({ addons, setAddons, yearly }) {
  const addonList = [
    {
      name: "Online service",
      monthly: "$1/mo",
      yearly: "$10/yr",
      description: "Access to multiplayer games",
    },
    {
      name: "Larger storage",
      monthly: "$2/mo",
      yearly: "$20/yr",
      description: "Extra 1TB of cloud save",
    },
    {
      name: "Customizable profile",
      monthly: "$2/mo",
      yearly: "$20/yr",
      description: "Custom theme on your profile",
    },
  ];

  return (
    <div id="add-ons">
      <h1>Pick add-ons</h1>
      <p className="form-info">Add-ons help enhance your gaming experience.</p>
      {addonList.map((addon, i) => (
        <div key={addon.name} className="card">
          <label
            htmlFor={addon.name}
            className={"click" + (addons[i] ? " checked" : "")}
          >
            <div>
              <input
                type="checkbox"
                name="addon"
                id={addon.name}
                checked={addons[i]}
                onChange={() =>
                  setAddons(addons.map((a, j) => (i === j ? !a : a)))
                }
              />
              <div>
                <p className="plan">{addon.name}</p>
                <p className="description">{addon.description}</p>
              </div>
            </div>
            <p className="plan-price">
              +{yearly ? addon.yearly : addon.monthly}
            </p>
          </label>
        </div>
      ))}
    </div>
  );
}

function Summery({ plan, yearly, addons, setStepNum }) {
  const plans = [
    {
      name: "Arcade",
      price: 9,
    },
    {
      name: "Advanced",
      price: 12,
    },
    {
      name: "Pro",
      price: 15,
    },
  ];

  const addonsArr = [
    {
      name: "Online service",
      price: 1,
    },
    {
      name: "Larger storage",
      price: 2,
    },
    {
      name: "Customizable profile",
      price: 2,
    },
  ];

  const total =
    addonsArr
      .map((addon, i) => (addons[i] ? addon.price : 0))
      .reduce((a, b) => a + b, plans[plan].price) * (yearly ? 10 : 1);

  return (
    <div id="summery">
      <h1>Finishing up</h1>
      <p className="form-info">
        Double-check everything looks OK before confirming.
      </p>
      <div className="bill-container">
        <div className="bill">
          <div className="plan">
            <div>
              <p className="plan-name">
                {plans[plan].name} ({yearly ? "Yearly" : "Monthly"})
              </p>
              <p id="change-plan" onClick={() => setStepNum(1)}>
                Change
              </p>
            </div>
            <p className="plan-price">
              ${plans[plan].price * (yearly ? 10 : 1)}/{yearly ? "yr" : "mo"}
            </p>
          </div>
          <hr />
          {addonsArr.map((addon, i) => {
            if (addons[i]) {
              return (
                <div className="addon" key={addon.name}>
                  <p>{addon.name}</p>
                  <p className="addon-price">
                    +${addon.price * (yearly ? 10 : 1)}/{yearly ? "yr" : "mo"}
                  </p>
                </div>
              );
            }
          })}
        </div>
        <div className="total">
          <p className="total-name">Total (per {yearly ? "year" : "month"})</p>
          <p className="total-price">
            +${total}/{yearly ? "yr" : "mo"}
          </p>
        </div>
      </div>
    </div>
  );
}

function Submitted() {
  return (
    <div id="submitted">
      <img src={thankYou} alt="thank you" />
      <h1>Thank you!</h1>
      <p>
        Thanks for confirming your subscription! We hope you have fun using our
        platform. If you ever need support, please feel free to email us at
        support@loremgaming.com.
      </p>
    </div>
  );
}

function Sidebar({ stepNum }) {
  const steps = ["Your info", "Select plan", "Add-ons", "Summery"];
  const list = [];

  steps.forEach((step, i) => {
    list.push(<Step key={"step" + i} i={i} step={step} stepNum={stepNum} />);
  });

  return <div id="progress-bar">{list}</div>;
}

function Step({ i, step, stepNum }) {
  return (
    <div className={"step-" + i + (stepNum === i ? " active" : "")}>
      <p className="step-count">{i + 1}</p>
      <div>
        <p className="step-count-w">Step {i + 1}</p>
        <p className="step-name">{step}</p>
      </div>
    </div>
  );
}
