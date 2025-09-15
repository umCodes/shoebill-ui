import { Badge, Button, Card, HStack, Skeleton, SkeletonText, Stack } from "@chakra-ui/react"


const HistorySkeleton = () => {
  return (
    <Card.Root m={2} p={4}>
         <Stack>
        <SkeletonText noOfLines={1} gap="2" />
        <HStack gap="4" my={4}>
            <Skeleton asChild loading={true}>
                <Badge>Select</Badge>
            </Skeleton>
            <Skeleton asChild loading={true}>
                <Badge>Select</Badge>
            </Skeleton>
            <Skeleton asChild loading={true}>
                <Badge>Select</Badge>
            </Skeleton>
            <Skeleton asChild loading={true}>
                <Badge>Select</Badge>
            </Skeleton>
            <Skeleton asChild loading={true}>
                <Badge>Select</Badge>
            </Skeleton>
            <Skeleton asChild loading={true}>
                <Badge>Select</Badge>
            </Skeleton>
        </HStack>
        <HStack>
        <SkeletonText noOfLines={1} w={100} gap="2" />

            <Skeleton ml="auto" loading={true}>
                <Button w={10} size={"sm"}>Select</Button>
            </Skeleton>
            <Skeleton loading={true}>
                <Button size={"sm"}>Select</Button>
            </Skeleton>
            <Skeleton loading={true}>
                <Button size={"sm"}>Select</Button>
            </Skeleton>
        </HStack>
         </Stack>
    </Card.Root>
  )
}

export default HistorySkeleton