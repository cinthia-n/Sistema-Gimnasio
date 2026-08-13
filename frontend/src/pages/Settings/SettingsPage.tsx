import { useState } from "react";

import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import ServicesSettings from "./componenets/ServicesSettings";
import PromotionsSettings from "./componenets/PromotionsSettings";
import ProductsSettings from "./componenets/ProductsSettings";


export default function SettingsPage() {

    const [tab, setTab] = useState(0);

    return (

        <>

            <Typography

                variant="h4"

                mb={3}

            >

                Configuraciones

            </Typography>

            <Paper>

                <Tabs

                    value={tab}

                    onChange={(_, value) =>

                        setTab(value)

                    }

                    variant="scrollable"

                    scrollButtons="auto"

                >

                    <Tab label="Servicios" />

                    <Tab label="Promociones" />

                    
                    
                </Tabs>

            </Paper>

            <Box mt={3}>

                {tab === 0 && (
                    
                    <ServicesSettings />
                    
                )}

                {tab === 1 && (

                    <PromotionsSettings />

                )}

                {tab === 2 && (

                    <ProductsSettings />

                )}                

            </Box>

        </>

    );

}