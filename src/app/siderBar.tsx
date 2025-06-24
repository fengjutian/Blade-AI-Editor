import styles from './siderBar.module.css';
import { Button } from "@/components/ui/button";
import { IconGitBranch } from "@tabler/icons-react";


const SiderBar = () => {
    return (<div className={styles.siderBarWrap}>
        <Button variant="outline" size="sm">
            <IconGitBranch />
            新建文档
        </Button>



    </div>)
}

export default SiderBar;

