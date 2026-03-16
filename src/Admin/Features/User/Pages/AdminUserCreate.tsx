


const AdminUserCreate = () => {
  return (
        <div className="imageBack">
      {load ? (
        <Loading />
      ) : (
        <div className="coverBack">
          <div className="container-md modal-content colorBack formProductContainer rounded-4 shadow">
            <div className="container mt-5">
              <h1>Creacion de usuario:</h1>
              <section
                className="needs-validation"
                id="updateItemForm"
              >
                <div className="row">
                  <div className="col-md-6 mb-3"></div>
                  <label htmlFor="email" className="form-label">
                    Email:
                  </label>
                  <input
                    className="form-control w-100 py-2 mb-3"
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="on"
                    value={input.email}
                    onChange={handleChange}
                  />
                  {error.email && <p className="errorMsg">{error.email}</p>}
                </div>
                <DoubleButton
                  className1="btn btn-sm btn-primary mb-3 me-2"
                  onClick1={handleSubmit}
                  disabled1={permit}
                  buttonText1="Crear"
                  className2="btn btn-sm btn-secondary mb-3 me-2"
                  onClick2={onClose}
                  buttonText2="Volver"
                />
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUserCreate