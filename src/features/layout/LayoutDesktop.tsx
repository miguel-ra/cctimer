import SideMenuCompact from "features/menu/SideMenuCompact";
import Navbar from "features/menu/Navbar";
import TimerDesktop from "features/timer/desktop/TimerDesktop";
import Box from "components/flexboxgrid/Box";

function LayoutDesktop() {
  return (
    <Box minHeight="100%" flexWrap="nowrap">
      <SideMenuCompact />
      <Box flexDirection="column" flex={1}>
        <Navbar />
        <TimerDesktop />
      </Box>
    </Box>
  );
}

export default LayoutDesktop;
