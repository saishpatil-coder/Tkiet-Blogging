import React from "react";

function Login() {
  return (
    <div className="container mt-5 p-5">
      <h1 class="text-success text-center">Login To Continue</h1>
      <div class="container mt-5">
        <div class="row justify-content-center">
          <div class="col-md-6">
            <div class="card">
              <div class="card-body p-4">
                <form
                  id="registrationForm"
                  className="d-flex flex-column gap-2"
                  action=""
                >
                  <div class="form-group">
                    <label for="email">Email</label>
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      placeholder="Email"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label for="password">Password</label>
                    <input
                      type="password"
                      class="form-control"
                      id="password"
                      placeholder="Password"
                      required
                    />
                  </div>
                  <button class="btn btn-danger mt-2" style={{ width: "30%" }}>
                    Login
                  </button>
                </form>
                <p class="mt-3">
                  Not registered?
                  <a href="#">Create an account</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
