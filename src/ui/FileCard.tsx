import { useColorModeValue } from "@/components/ui/color-mode";
import { Flex, Heading, Text, Box, Skeleton } from "@chakra-ui/react";
import { LuFile } from "react-icons/lu";

const FileCard = ({ name, pages }: { name: string; pages: number }) => {
  return (
    <Flex
      align="center"
      gap={3}
      border="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.800")}
      rounded="xl"
      p={3}
      _hover={{ borderColor: "gray.500", cursor: "pointer" }}
      transition="all 0.2s ease-in-out"
    >
      <Box
        bg={useColorModeValue("gray.100", "gray.800")}
        p={2}
        rounded="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
        >
        <LuFile size={20} />
    </Box>

      <Flex direction="column" flex="1" minW={0}>

        <Skeleton loading={!pages}>
        <Heading
          size="sm"
          title={name} // tooltip on hover if text is truncated
        >
          {name}
        </Heading>
        </Skeleton>
        <Skeleton  loading={!pages}>
            <Text fontSize="xs" color="gray.400">
            {pages} {pages === 1 ? "page" : "pages"}
          </Text>
        </Skeleton>
      </Flex>
    </Flex>
  );
};

export default FileCard;
