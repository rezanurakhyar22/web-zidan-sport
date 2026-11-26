import { AthleteService } from 'src/routes/athlete/service';
export declare class TasksService {
    private athleteService;
    private readonly logger;
    constructor(athleteService: AthleteService);
    handlerTaskResetPoint(): Promise<void>;
}
