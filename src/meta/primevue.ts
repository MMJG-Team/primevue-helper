// [...$0.children].map((c) => {
//     console.log(c)
//     const title = c.querySelector('.menu-child-category')
//     const label = title.textContent
//     const children = [...c.querySelectorAll('li span')].map(item => item.textContent)
//     return {
//         label,
//         children
//     }
// })

import { ComponentMeta } from "../type";

export const COMPONENT_TREE_DATA: ComponentMeta[] = [
    {
        label: "Form",
        description: "表单",
        children: [
            { label: "AutoComplete", description: "自动完成" },
            { label: "CascadeSelect", description: "级联选择" },
            { label: "Checkbox", description: "复选框" },
            { label: "ColorPicker", description: "颜色选择器" },
            { label: "DatePicker", description: "日期选择器" },
            { label: "Editor", description: "编辑器" },
            { label: "FloatLabel", description: "浮动标签" },
            { label: "IconField", description: "图标字段" },
            { label: "InputGroup", description: "输入组" },
            { label: "InputMask", description: "输入掩码" },
            { label: "InputNumber", description: "数字输入" },
            { label: "InputOtp", description: "一次性密码输入" },
            { label: "InputText", description: "文本输入" },
            { label: "Knob", description: "旋钮" },
            { label: "Listbox", description: "列表框" },
            { label: "MultiSelect", description: "多选" },
            { label: "Password", description: "密码" },
            { label: "RadioButton", description: "单选按钮" },
            { label: "Rating", description: "评分" },
            { label: "Select", description: "选择" },
            { label: "SelectButton", description: "选择按钮" },
            { label: "Slider", description: "滑块" },
            { label: "Textarea", description: "文本域" },
            { label: "ToggleButton", description: "切换按钮" },
            { label: "ToggleSwitch", description: "切换开关" },
            { label: "TreeSelect", description: "树选择" },
        ],
    },
    {
        label: "Button",
        description: "按钮",
        children: [
            { label: "Button", description: "按钮" },
            { label: "SpeedDial", description: "速度拨号" },
            { label: "SplitButton", description: "分割按钮" },
        ],
    },
    {
        label: "Data",
        description: "数据",
        children: [
            { label: "DataTable", description: "数据表" },
            { label: "DataView", description: "数据视图" },
            { label: "OrderList", description: "订单列表" },
            { label: "OrgChart", description: "组织结构图" },
            { label: "Paginator", description: "分页器" },
            { label: "PickList", description: "选择列表" },
            { label: "Timeline", description: "时间线" },
            { label: "Tree", description: "树" },
            { label: "TreeTable", description: "树表" },
            { label: "VirtualScroller", description: "虚拟滚动" },
        ],
    },
    {
        label: "Panel",
        description: "面板",
        children: [
            { label: "Accordion", description: "手风琴" },
            { label: "Card", description: "卡片" },
            { label: "Deferred", description: "延迟" },
            { label: "Divider", description: "分隔符" },
            { label: "Fieldset", description: "字段集" },
            { label: "Panel", description: "面板" },
            { label: "ScrollPanel", description: "滚动面板" },
            { label: "Splitter", description: "分割器" },
            { label: "Stepper", description: "步骤" },
            { label: "Tabs", description: "标签页" },
            { label: "Toolbar", description: "工具栏" },
        ],
    },
    {
        label: "Overlay",
        description: "覆盖",
        children: [
            { label: "ConfirmDialog", description: "确认对话框" },
            { label: "ConfirmPopup", description: "确认弹出" },
            { label: "Dialog", description: "对话框" },
            { label: "Drawer", description: "抽屉" },
            { label: "DynamicDialog", description: "动态对话框" },
            { label: "Popover", description: "弹出框" },
            { label: "Tooltip", description: "工具提示" },
        ],
    },
    { label: "File", description: "文件", children: [{ label: "Upload", description: "上传" }] },
    {
        label: "Menu",
        description: "菜单",
        children: [
            { label: "Breadcrumb", description: "面包屑" },
            { label: "ContextMenu", description: "上下文菜单" },
            { label: "Dock", description: "停靠" },
            { label: "Menu", description: "菜单" },
            { label: "Menubar", description: "菜单栏" },
            { label: "MegaMenu", description: "巨量菜单" },
            { label: "PanelMenu", description: "面板菜单" },
            { label: "TieredMenu", description: "分层菜单" },
        ],
    },
    { label: "Chart", description: "图表", children: [{ label: "Chart.js", description: "Chart.js" }] },
    { label: "Messages", description: "消息", children: [{ label: "Message", description: "消息" }, { label: "Toast", description: "提示" }] },
    {
        label: "Media",
        description: "媒体",
        children: [
            { label: "Carousel", description: "轮播" },
            { label: "Galleria", description: "画廊" },
            { label: "Image", description: "图片" },
        ],
    },
    {
        label: "Misc",
        description: "杂项",
        children: [
            { label: "AnimateOnScroll", description: "滚动动画" },
            { label: "Avatar", description: "头像" },
            { label: "Badge", description: "徽章" },
            { label: "BlockUI", description: "阻止UI" },
            { label: "Chip", description: "纸片" },
            { label: "FocusTrap", description: "焦点陷阱" },
            { label: "Inplace", description: "原地" },
            { label: "Fluid", description: "流体" },
            { label: "MeterGroup", description: "计量组" },
            { label: "ScrollTop", description: "滚动到顶部" },
            { label: "Skeleton", description: "骨架屏" },
            { label: "ProgressBar", description: "进度条" },
            { label: "ProgressSpinner", description: "进度旋转器" },
            { label: "Ripple", description: "波纹" },
            { label: "StyleClass", description: "样式类" },
            { label: "Tag", description: "标签" },
            { label: "Terminal", description: "终端" },
        ],
    },
];
