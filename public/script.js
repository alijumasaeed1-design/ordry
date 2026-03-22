async function subscribe(plan) {
  try {
    const res = await fetch("/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ plan })
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Failed to create checkout session");
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
}

function startCheckout(plan) {
  const user = JSON.parse(localStorage.getItem("ordryUser"));
  if (!user) {
    window.location.href = "signup.html";
    return;
  }
  subscribe(plan);
}