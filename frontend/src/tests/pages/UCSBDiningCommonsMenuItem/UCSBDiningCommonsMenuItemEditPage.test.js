import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBDiningCommonsMenuItemEditPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBDiningCommonsMenuItemEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {

            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsbdiningcommonsmenuitem", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBDiningCommonsMenuItemEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Menu Item");
            expect(screen.queryByTestId("MenuItemForm-name")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsbdiningcommonsmenuitem", { params: { id: 17 } }).reply(200, {
                id: 17,
                diningCommonsCode: "portola",
                name: "Chicken Salad",
                station: "Entrees"
            });
            axiosMock.onPut('/api/ucsbdiningcommonsmenuitem').reply(200, {
                id: "17",
                diningCommonsCode: "portola",
                name: "Chicken Salad",
                station: "Entrees"
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBDiningCommonsMenuItemEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemForm-id");

            const idField = screen.getByTestId("MenuItemForm-id");
            const diningCommonsCodeField = screen.getByTestId("MenuItemForm-diningCommonsCode");
            const nameField = screen.getByTestId("MenuItemForm-name");
            const stationField = screen.getByTestId("MenuItemForm-station");
            const submitButton = screen.getByTestId("MenuItemForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("17");
            expect(diningCommonsCodeField).toBeInTheDocument();
            expect(diningCommonsCodeField).toHaveValue("portola");
            expect(nameField).toBeInTheDocument();
            expect(nameField).toHaveValue("Chicken Salad");
            expect(stationField).toBeInTheDocument();
            expect(stationField).toHaveValue("Entrees");

            expect(submitButton).toHaveTextContent("Update");

            // fireEvent.change(diningCommonsCodeField, { target: { value: 'dlg' } });
            // fireEvent.change(nameField, { target: { value: 'Tofu Fried Rice(v)' } });
            // fireEvent.change(stationField, { target: { value: 'Entree Specials' } });
            // fireEvent.click(submitButton);

            // await waitFor(() => expect(mockToast).toBeCalled());
            // expect(mockToast).toBeCalledWith("Menu Item Updated - id: 17 name: Tofu Fried Rice(v)");
            
            // expect(mockNavigate).toBeCalledWith({ "to": "/ucsbdiningcommonsmenuitem" });

            // expect(axiosMock.history.put.length).toBe(1); // times called
            // expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            // expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
            //     diningCommonsCode: "dlg",
            //     name: 'Tofu Fried Rice(v)',
            //     station: 'Entree Specials'
            // })); // posted object


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBDiningCommonsMenuItemEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemForm-id");

            const idField = screen.getByTestId("MenuItemForm-id");
            const diningCommonsCodeField = screen.getByTestId("MenuItemForm-diningCommonsCode");
            const nameField = screen.getByTestId("MenuItemForm-name");
            const stationField = screen.getByTestId("MenuItemForm-station");
            const submitButton = screen.getByTestId("MenuItemForm-submit");
            
            expect(idField).toHaveValue("17");
            expect(diningCommonsCodeField).toHaveValue("portola");
            expect(nameField).toHaveValue("Chicken Salad");
            expect(stationField).toHaveValue("Entrees");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(diningCommonsCodeField, { target: { value: 'dlg' } })
            fireEvent.change(nameField, { target: { value: 'Tofu Fried Rice(v)' } })
            fireEvent.change(stationField, { target: { value: 'Entree Specials' } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Menu Item Updated - id: 17 name: Tofu Fried Rice(v)");
            expect(mockNavigate).toBeCalledWith({ "to": "/ucsbdiningcommonsmenuitem" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                 diningCommonsCode: "dlg",
                 name: "Tofu Fried Rice(v)",
                 station: "Entree Specials"
             })); 
        });

       
    });
});
