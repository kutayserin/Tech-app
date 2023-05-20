import { Carousel } from "./components/Carousel";
import { ExploreTopProducts } from "./components/ExploreTopProducts";
import { Heros } from "./components/Heros";
import { ManageService } from "./components/ManageService";

export const HomePage = () => 
{
    return (
        <>
        <ExploreTopProducts />
        <Carousel />
        <Heros />
        <ManageService />
        </>
    );
}