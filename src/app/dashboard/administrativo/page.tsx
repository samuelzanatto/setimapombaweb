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
        <main className="flex flex-col w-full items-center justify-center px-10">
            <Tabs defaultValue="cultos" className="flex flex-col items-center justify-center w-full space-y-6">
                <header>
                    <TabsList>
                        <TabsTrigger value="cultos">Cultos</TabsTrigger>
                        <TabsTrigger value="agenda">Agenda</TabsTrigger>
                        <TabsTrigger value="eventos">Eventos</TabsTrigger>
                        <TabsTrigger value="locais">Locais</TabsTrigger>
                        <TabsTrigger value="mensagens">Mensagens</TabsTrigger>
                        <TabsTrigger value="hinos">Hinos</TabsTrigger>
                        <TabsTrigger value="cargos">Cargos</TabsTrigger>
                        <TabsTrigger value="usuarios">Usuários</TabsTrigger>
                  </TabsList>
                </header>

                <article className="w-full">
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