import { DeepPartial, Theme } from "@chakra-ui/react";

const Button: DeepPartial<Theme["components"]["Button"] > = {
    baseStyle : {
        borderRadius : "14px",
        py: "4",
    }
}

export default Button;