import { 
    Tabs, 
    TabsContent, 
    TabsList, 
    TabsTrigger 
} from "@/components/ui/tabs"
import ScheduleServiceManager from "./scheduleServiceManager"
import ScheduleMeetingManager from "./scheduleMeetingManager"
import ScheduleTestManager from "./scheduleTestManager"

export default function ScheduleManager() {
    return (
        <main className="flex flex-col w-full items-center justify-center px-10">
            <Tabs defaultValue="cultos" className="flex flex-col items-center justify-center w-full space-y-6">
                <header>
                    <TabsList>
                        <TabsTrigger value="cultos">Cultos</TabsTrigger>
                        <TabsTrigger value="reunioes">Reuniões</TabsTrigger>
                        <TabsTrigger value="ensaios">Ensaios</TabsTrigger>
                  </TabsList>
                </header>

                <article className="w-full">
                    <TabsContent value="cultos">
                        <ScheduleServiceManager />
                    </TabsContent>
                    <TabsContent value="reunioes">
                        <ScheduleMeetingManager />
                    </TabsContent>
                    <TabsContent value="ensaios">
                        <ScheduleTestManager />
                    </TabsContent>
                </article>
            </Tabs>
        </main>
    )
}