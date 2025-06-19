import Button from "@/components/common/Button";
import Container from "@/routes/Container";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <Container>
      <div className="mt-18">
        <div className="flex flex-col items-center justify-center py-40 text-center">
          <h1 className="text-6xl md:text-[110px] font-semibold mb-4"><p>404</p> Not Found</h1>
          <p className="text-lg text-gray-700 mb-18">Your visited page not found. You may go home page.</p>
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