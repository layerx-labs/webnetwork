export default function CreateBountyContainer({ children }) {
  return (
    <div 
      className="d-flex flex-column justify-content-between bg-gray-900 bg-xl-gray-950 create-task-container-height"
    >
      {children}
    </div>
  );
}
