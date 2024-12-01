import { 
    Tabs, 
    TabsContent, 
    TabsList, 
    TabsTrigger 
} from "@/components/ui/tabs"
import EventsManager from "./components/servicesManager"
import UsersManager from "./components/usersManager"

export default function AdministrativoPage() {
    return (
        <main className="flex flex-col w-full items-center justify-center px-10">
            <Tabs defaultValue="cultos" className="flex flex-col items-center justify-center w-full space-y-6">
                <header>
                    <TabsList>
                        <TabsTrigger value="cultos">Cultos</TabsTrigger>
                        <TabsTrigger value="usuarios">Usuários</TabsTrigger>
                  </TabsList>
                </header>

                <article className="w-full">
                    <TabsContent value="cultos">
                        <EventsManager />
                    </TabsContent>
                    <TabsContent value="usuarios">
                        <UsersManager />
                    </TabsContent>
                </article>
            </Tabs>
        </main>
    )
}