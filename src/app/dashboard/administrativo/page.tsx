import { 
    Tabs, 
    TabsContent, 
    TabsList, 
    TabsTrigger 
} from "@/components/ui/tabs"
import ServiceManager from "./components/serviceManager"
import UserManager from "./components/usersManager"
import EventManager from "./components/eventManager"
import ScheduleManager from "./components/scheduleManager/scheduleManager"
import BookManager from "./components/bookManager"
import MusicManager from "./components/musicManager"
import RoleManager from "./components/roleManager"
import LocalManager from "./components/localManager"

export default function AdministrativoPage() {
    return (
        <main className="flex flex-col w-full items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10">
            <Tabs defaultValue="cultos" className="flex flex-col items-center justify-center w-full space-y-4 md:space-y-6">
                <header className="w-full flex justify-center">
                    <TabsList className="flex flex-wrap justify-center gap-2">
                        <TabsTrigger className="text-sm md:text-base" value="cultos">Cultos</TabsTrigger>
                        <TabsTrigger className="text-sm md:text-base" value="agenda">Agenda</TabsTrigger>
                        <TabsTrigger className="text-sm md:text-base" value="eventos">Eventos</TabsTrigger>
                        <TabsTrigger className="text-sm md:text-base" value="locais">Locais</TabsTrigger>
                        <TabsTrigger className="text-sm md:text-base" value="mensagens">Mensagens</TabsTrigger>
                        <TabsTrigger className="text-sm md:text-base" value="hinos">Hinos</TabsTrigger>
                        <TabsTrigger className="text-sm md:text-base" value="cargos">Cargos</TabsTrigger>
                        <TabsTrigger className="text-sm md:text-base" value="usuarios">Usuários</TabsTrigger>
                    </TabsList>
                </header>

                <article className="w-full max-w-full overflow-x-auto">
                    <TabsContent value="cultos">
                        <ServiceManager />
                    </TabsContent>
                    <TabsContent value="agenda">
                        <ScheduleManager />
                    </TabsContent>
                    <TabsContent value="eventos">
                        <EventManager />
                    </TabsContent>
                    <TabsContent value="mensagens">
                        <BookManager />
                    </TabsContent>
                    <TabsContent value="hinos">
                        <MusicManager />
                    </TabsContent>
                    <TabsContent value="cargos">
                        <RoleManager />
                    </TabsContent>
                    <TabsContent value="usuarios">
                        <UserManager />
                    </TabsContent>
                    <TabsContent value="locais">
                        <LocalManager />
                    </TabsContent>
                </article>
            </Tabs>
        </main>
    )
}