import Button from "@/components/common/Button";
import Container from "@/routes/Container";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <Container>
      <div className="mt-18">
        <div className="flex flex-col items-center justify-center py-40">
          <h1 className="text-[110px] font-medium mb-4">404 Not Found</h1>
          <p className="text-lg text-gray-700 mb-20">Your visited page not found. You may go home page.</p>
          <Link to="/">
            <Button>
              Back To Home Page
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}