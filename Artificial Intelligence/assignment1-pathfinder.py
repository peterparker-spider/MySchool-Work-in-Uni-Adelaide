

from copy import deepcopy
import sys

class coord():
    def __init__(self, x, y) -> None:
        self.x = x
        self.y = y
    
    def is_valid(self, size_x, size_y):
        if self.x < 0 or self.x >= size_x:
            return False
        if self.y < 0 or self.y >= size_y:
            return False
        return True


class pathfinder_BFS():
    def __init__(self, dataPath) -> None:
        data_fp = open(dataPath)
        lines = data_fp.readlines()
        data_fp.close()
        lines = [line.replace('\n', '') for line in lines]
        lines = [line.split(' ') for line in lines]
        for i in range(len(lines)):
            lines[i] = [self.str_to_int(s) for s in lines[i]]
        
        self.grid = lines[3:]
        self.grid_visited = {}

        self.end_coord = coord(lines[2][0]-1, lines[2][1]-1)
        self.start_coord = coord(lines[1][0]-1, lines[1][1]-1)
        self.grid_size = coord(*lines[0])
        self.answer = None
    
    def get_answer(self):
        path = self.search()
        if path == None or len(path) == 0 :
            print('null')
            return

        for c in path:
            self.grid[c.x][c.y] = '*'
        
        for line in self.grid:
            line = [str(i) for i in line]
            print(' '.join(line))


    def str_to_int(self, s):
        try:
            return int(s)
        except:
            return s
    
    def search(self):
        bfs_search_paths_queue = []
        bfs_search_paths_queue.append([self.start_coord])
        self.visit(self.start_coord)

        while len(bfs_search_paths_queue) != 0:
            cur_path = self.get_cur_path(bfs_search_paths_queue)
            bfs_search_paths_queue.remove(cur_path)

            if (len(cur_path) != 0 and cur_path[-1].x == self.end_coord.x and cur_path[-1].y == self.end_coord.y):
                self.answer = cur_path
                return self.answer


            next_paths = self.get_next_paths(cur_path)
            bfs_search_paths_queue += next_paths
        


    def get_cur_path(self, bfs_queue):
        return bfs_queue[0]

    def get_next_paths(self, cur_path):
        cur_coord = cur_path[-1]
        next_coords = self.get_next_coords(cur_coord)
        next_paths = []
        for i in range(len(next_coords)):
            self.visit(next_coords[i])
            next_path = deepcopy(cur_path)
            next_path.append(next_coords[i])
            next_paths.append(next_path)
        
        return next_paths


    def get_next_coords(self, cur_coord):
        next_coords = []
        next_coords.append(coord(cur_coord.x-1, cur_coord.y))
        next_coords.append(coord(cur_coord.x+1, cur_coord.y))
        next_coords.append(coord(cur_coord.x, cur_coord.y-1))
        next_coords.append(coord(cur_coord.x, cur_coord.y+1))
        un_valid = []
        for c in next_coords:
            if c.is_valid(self.grid_size.x, self.grid_size.y) == False:
                un_valid.append(c)
            elif self.is_visited(c) == True:
                un_valid.append(c)
            elif self.grid[c.x][c.y] == 'X':
                un_valid.append(c)
        
        for c in un_valid:
            next_coords.remove(c)

        return next_coords


    def visit(self, coord_x):
        self.grid_visited[(coord_x.x, coord_x.y)] = True


    def is_visited(self, coord_x):
        try:
            return self.grid_visited[(coord_x.x, coord_x.y)]
        except:
            return False




class pathfinder_UCS(pathfinder_BFS):

    def get_cur_path(self, bfs_queue):
        costs = [self.get_cost(p) for p in bfs_queue]
        min_cost = min(costs)
        for i in range(len(costs)):
            if costs[i] == min_cost:
                return bfs_queue[i]
    
    def get_w(self, coord):
        return self.grid[coord.x][coord.y]

    def get_cost(self, path):
        if (len(path) == 1):
            return 1
        return self.get_w(path[-1]) - self.get_w(path[-2])
        


class pathfinder_Astar(pathfinder_UCS):
    def set_heuristic(self, s):
        self.euclidean_heuristic = True
        if s == 'manhattan':
            self.euclidean_heuristic = False

    def get_heuristic(self, coord_x):
        if self.euclidean_heuristic:
            return ((self.end_coord.x - coord_x.x)**2 + (self.end_coord.y - coord_x.y)**2)**0.5
        else:
            return abs(self.end_coord.x - coord_x.x) + abs(self.end_coord.y - coord_x.y)


    def get_cost(self, path):
        cost = 0
        for i in range(len(path)-1):
            m = self.get_w(path[i+1]) - self.get_w(path[i])
            cost += max(0, m) + 1
        
        cost += self.get_heuristic(path[-1])
        return cost


map_path = sys.argv[1]
algotithm = sys.argv[2]
if len(sys.argv) == 4:
    heuristic = sys.argv[3]

path_finder = None
if algotithm == 'bfs':
    path_finder = pathfinder_BFS(map_path)
elif algotithm == 'ucs':
    path_finder = pathfinder_UCS(map_path)
elif algotithm == 'astar':
    path_finder = pathfinder_Astar(map_path)
    path_finder.set_heuristic(heuristic)

path_finder.get_answer()

