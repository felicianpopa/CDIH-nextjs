import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function Loading() {
  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-center align-items-center flex-column py-5">
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          size="3x"
          className="mb-3 text-primary"
        />
        <h2 className="h4 mt-3">Loading offer data...</h2>
        <p className="text-muted">Please wait while we prepare your offer</p>
      </div>
    </div>
  );
}
